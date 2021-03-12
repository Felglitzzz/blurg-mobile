import * as React from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import { View, Text } from '../../../components/Themed';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import QuillEditor, { QuillToolbar, SelectionChangeData } from 'react-native-cn-quill';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import { useMutation } from '@apollo/client';
import { SAVE_BLOG } from '../../../shared/constants/graphql.constant';
import { toaster } from '../../../shared/service/toaster.service';

const HEADER_TAG = '<h1></h1>';
const PARAGRAPH_BREAK_TAG = '<p><br></p>'
const BREAK_TAG = '<br>';

const HEADER_TAG_REGEX = /<h1><\/h1>/g;
const PARAGRAPH_BREAK_TAG_REGEX = /<p><br><\/p>/g
const BREAK_TAG_REGEX = /<br>/g;

export default function CreateBlogScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const _editor = React.createRef<QuillEditor>();
  const [lastIndex, setLastIndex] = React.useState(0);
  const [saveBlog] = useMutation(SAVE_BLOG);
  const [buttonDisabled, setButtonDisabled] = React.useState(false)

  const save = async () => {
    const content = await _editor.current?.getHtml();
    let sanitizedHtml = content?.toString()?.replace(PARAGRAPH_BREAK_TAG_REGEX, '');
    sanitizedHtml = sanitizedHtml?.toString()?.replace(BREAK_TAG_REGEX, '');

    try {
      const { data } = await saveBlog({
        variables: { saveBlogInput: {
          content: sanitizedHtml,
          title: getHeader(content)
        }}
      })
  
      if (data) {
        navigation.replace('Blog')
      }
    } catch(err) {
      toaster('error', err.message)
    }
  };

  const onHtmlChange = (data: Record<'html', string>) => {
   const sanitizedHtml = data?.html?.replace(BREAK_TAG_REGEX, '');
    if (sanitizedHtml === HEADER_TAG) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false)
    }
    setLastIndex(data?.html?.length);
  }

  const customHandler = (name: string, value: any) => {
    if (name === 'image') {
      _editor.current?.insertEmbed(
        lastIndex,
        'image',
        'https://picsum.photos/400/100'
      );
    } else {
      console.log(`${name} clicked with value: ${value}`);
    }
  };

  const getHeader = (html: string) => {
    const OPENING_H1_TAG = '<h1>';
    const CLOSING_H1_TAG = '</h1>';
    const OPENING_H2_TAG = '<h2>';
    const CLOSING_H2_TAG = '</h2>';
    html.replace(BREAK_TAG_REGEX, '');
    if (html.indexOf(OPENING_H1_TAG) !== -1) {
      return html.substring(html.indexOf(OPENING_H1_TAG) + OPENING_H1_TAG.length, html.indexOf(CLOSING_H1_TAG));
    } if (html.indexOf(OPENING_H2_TAG) !== -1){
      return html.substring(html.indexOf(OPENING_H2_TAG) + OPENING_H2_TAG.length, html.indexOf(CLOSING_H2_TAG));
    } else {
      return '';
    }
  }

  const handleSelectionChange = async (data: SelectionChangeData) => {
    const { range } = data;
    if (range) {
      if (range.length === 0) {
        setLastIndex(range.index )
        console.log('User cursor is on', range.index);
      } else {
        const text = await _editor.current?.getText(
          range.index,
          range.length
        );
        console.log('User has highlighted', text);
      }
    } else {
      console.log('Cursor not in the editor');
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.toolbarContainer}>
        <QuillToolbar
        styles={{
          toolbar: { paddingBottom: 6, borderBottomWidth: 1, backgroundColor: '#fff'},
          selection: {}
        }}
          editor={_editor}
          container={false}
          options={[
            ['bold', 'italic', 'underline'],
            [{ header: 1 }, { header: 2 }],
            ['image',],
          ]}
          theme={{ background: 'white', color: '#000', overlay: 'rgba(0,0,0,.1)', size: 30, }}
          custom={{
            handler: customHandler,
            actions: ['image'],
          }}
          />
      </View>
      
      <View style={styles.editorContainer}>
        <QuillEditor
            style={styles.editor}
            ref={_editor}
            container={false}
            onSelectionChange={handleSelectionChange}
            onHtmlChange={({ html }) => onHtmlChange(html)}
            initialHtml="<h1>Blog Header</h1>"
          />
      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity
          disabled={buttonDisabled}
          onPress={save}
          style={[styles.button, buttonDisabled ? { backgroundColor: 'gray'} : undefined]}>
            <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>

    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: hp(2),
    flex: 1,
    backgroundColor: '#fff',
    padding: hp(2)
  },
  title: {
    fontSize: hp(2.5),
  },
  editorContainer: {
    height: hp(40),
    ...Platform.select({
      android: {
        borderColor: 'black',
        borderWidth: 1,
      }
    })
  },
  toolbarContainer: {
    marginTop: hp(1),
    marginBottom: hp(2)
  },
  editor: {
    padding: 0,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
      }
    })
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: hp(2)
  },
  button: {
    width: wp(20),
    borderRadius: 6,
    height: hp(4),
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  buttonText: {
    color: '#fff',
    fontSize: hp(2)
  },
});
