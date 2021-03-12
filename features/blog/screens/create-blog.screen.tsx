import * as React from 'react';
import { Platform, StyleProp, StyleSheet, TextInput, useColorScheme, ViewStyle } from 'react-native';
import { View, Text } from '../../../components/Themed';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import QuillEditor, { QuillToolbar, SelectionChangeData, TextChangeData } from 'react-native-cn-quill';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import { useMutation } from '@apollo/client';
import { SAVE_BLOG } from '../../../shared/constants/graphql.constant';

export default function CreateBlogScreen() {
  const colorScheme = useColorScheme();
  const _editor = React.createRef<QuillEditor>();
  const [saveBlog] = useMutation(SAVE_BLOG);

  const handleGetHtml = async () => {
    const content = await _editor.current?.getHtml();
    
    console.log('content--->>', content);

    console.log(getHeader(content))


    // const { data, loading } = await saveBlog({
    //   variables: { saveBlogInput: {
    //     content
    //   }}
    // })
  };

  const getHeader = (html: string) => {
    console.log('html--->>', html);
    const OPENING_H1_TAG = '<h1>';
    const CLOSING_H1_TAG = '</h1>';
    const OPENING_H2_TAG = '<h2>';
    const CLOSING_H2_TAG = '</h2>';
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
      <View>
        <Text style={styles.title}>Create a blog</Text>
      </View>

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
          />
      </View>
      
      <View style={styles.editorContainer}>
        <QuillEditor
            style={styles.editor}
            ref={_editor}
            container={false}
            onSelectionChange={handleSelectionChange}
            // onTextChange={handleTextChange}
            onHtmlChange={({ html }) => {
              
              console.log('see', getHeader(html))
            }}

            initialHtml="<h1>Blog Header</h1>"
          />
      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleGetHtml}
          style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}>
            <Text style={styles.buttonText}>Publish</Text>
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
