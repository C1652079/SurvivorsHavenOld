import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { HideWithKeyboard } from 'react-native-hide-with-keyboard';
import { FormButton, FormInput, ErrorMessage } from '../../components/';
import { withFirebaseHOC } from '../../config/';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password must have at least 6 characters '),
});
const Login = (props) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [passwordIcon, setPasswordIcon] = useState('ios-eye');

  const GoToSignup = () => {
    return props.navigation.navigate('Signup');
  };

  const GoToForgotPassword = () => {
    return props.navigation.navigate('ForgotPassword');
  };

  const PassVisibilityHandler = () => {
    if (passwordIcon === 'ios-eye') {
      setPasswordIcon('ios-eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (passwordIcon === 'ios-eye-off') {
      setPasswordIcon('ios-eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const OnLoginHandler = async (values, actions) => {
    const { email, password } = values;
    try {
      const response = await props.firebase.loginWithEmail(email, password);

      if (response.user) {
        props.navigation.navigate('App');
      }
    } catch (error) {
      actions.setFieldError('general', error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values, actions) => {
          OnLoginHandler(values, actions);
        }}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          values,
          handleSubmit,
          errors,
          isValid,
          touched,
          handleBlur,
          isSubmitting,
        }) => (
          <>
            <FormInput
              name="email"
              value={values.email}
              onChangeText={handleChange('email')}
              placeholder="Enter email"
              autoCapitalize="none"
              iconName="ios-mail"
              iconColor="#2C384A"
              onBlur={handleBlur('email')}
            />
            <ErrorMessage errorValue={touched.email && errors.email} />
            <FormInput
              name="password"
              value={values.password}
              onChangeText={handleChange('password')}
              placeholder="Enter password"
              secureTextEntry={passwordVisibility}
              iconName="ios-lock"
              iconColor="#2C384A"
              onBlur={handleBlur('password')}
              rightIcon={
                <TouchableOpacity onPress={PassVisibilityHandler}>
                  <Ionicons name={passwordIcon} size={28} color="grey" />
                </TouchableOpacity>
              }
            />
            <ErrorMessage errorValue={touched.password && errors.password} />
            <View style={styles.buttonContainer}>
              <FormButton
                buttonType="outline"
                onPress={handleSubmit}
                title="LOGIN"
                buttonColor="#039BE5"
                disabled={!isValid || isSubmitting}
                loading={isSubmitting}
              />
            </View>
            <ErrorMessage errorValue={errors.general} />
          </>
        )}
      </Formik>
      <Button
        title="Don't have an account? Sign Up"
        onPress={GoToSignup}
        titleStyle={{
          color: '#F57C00',
        }}
        type="clear"
      />
      <Button
        title="Forgot Password?"
        onPress={GoToForgotPassword}
        titleStyle={{
          color: '#039BE5',
        }}
        type="clear"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  buttonContainer: {
    margin: 25,
  },
});

export default withFirebaseHOC(Login);
