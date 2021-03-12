// import {NavigationActions, StackActions} from '@react-navigation/stack';
// let _navigator: {
//   dispatch: (param: any) => void;
// };

// function setTopLevelNavigator(navigatorRef: any) {
//   _navigator = navigatorRef;
// }

// function navigate(routeName: string, params?: object) {
//   _navigator.dispatch(
//     NavigationActions.navigate({
//       routeName,
//       params,
//     }),
//   );
// }

// function reset(index = 0, actions: any) {
//   _navigator.dispatch(
//     StackActions.reset({
//       index,
//       key: undefined,
//       actions,
//     }),
//   );
// }

// export default {
//   reset,
//   navigate,
//   setTopLevelNavigator,
// };