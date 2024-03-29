import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormButton, FormInput, ErrorMessage } from '../../components/';
import { withFirebaseHOC } from '../../config/';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .label('Name')
    .required()
    .min(2, 'Must have at least 2 characters'),
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
  password: Yup.string()
    .label('Password')
    .required()
    .min(6, 'Password should be at least 6 characters '),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must match the Password')
    .required('Confirm Password is required'),
  check: Yup.boolean().oneOf([true], 'Please check the agreement'),
});

const Signup = (props) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [passwordIcon, setPasswordIcon] = useState('ios-eye');
  const [confirmPasswordIcon, setConfirmPasswordIcon] = useState('ios-eye');
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(
    true
  );

  const GoToLogin = () => {
    return props.navigation.navigate('Login');
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

  const ConfirmPassVisibilityHandler = () => {
    if (confirmPasswordIcon === 'ios-eye') {
      setConfirmPasswordIcon('ios-eye-off');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    } else if (confirmPasswordIcon === 'ios-eye-off') {
      setConfirmPasswordIcon('ios-eye');
      setConfirmPasswordVisibility(!confirmPasswordVisibility);
    }
  };

  const OnSignupHandler = async (values, actions) => {
    const { name, email, password } = values;
    try {
      const response = await props.firebase.signupWithEmail(email, password);

      if (response.user.uid) {
        const { uid } = response.user;
        const userData = { email, name, uid };
        await props.firebase.createNewUser(userData);
        props.navigation.navigate('App');
      }
    } catch (error) {
      actions.setFieldError('general', error.message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      enabled
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            check: false,
          }}
          onSubmit={(values, actions) => {
            OnSignupHandler(values, actions);
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
            setFieldValue,
          }) => (
            <>
              <FormInput
                name="name"
                value={values.name}
                onChangeText={handleChange('name')}
                placeholder="Enter your full name"
                iconName="md-person"
                iconColor="#2C384A"
                onBlur={handleBlur('name')}
              />
              <ErrorMessage errorValue={touched.name && errors.name} />
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
                iconName="ios-lock"
                iconColor="#2C384A"
                onBlur={handleBlur('password')}
                secureTextEntry={passwordVisibility}
                rightIcon={
                  <TouchableOpacity onPress={PassVisibilityHandler}>
                    <Ionicons name={passwordIcon} size={28} color="grey" />
                  </TouchableOpacity>
                }
              />
              <ErrorMessage errorValue={touched.password && errors.password} />
              <FormInput
                name="password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                placeholder="Confirm password"
                iconName="ios-lock"
                iconColor="#2C384A"
                onBlur={handleBlur('confirmPassword')}
                secureTextEntry={confirmPasswordVisibility}
                rightIcon={
                  <TouchableOpacity onPress={ConfirmPassVisibilityHandler}>
                    <Ionicons
                      name={confirmPasswordIcon}
                      size={28}
                      color="grey"
                    />
                  </TouchableOpacity>
                }
              />
              <ErrorMessage
                errorValue={touched.confirmPassword && errors.confirmPassword}
              />
              <CheckBox
                checkedIcon="check-box"
                iconType="material"
                uncheckedIcon="check-box-outline-blank"
                title="Agree to terms and conditions"
                checkedTitle="You agreed to our terms and conditions"
                checked={values.check}
                onPress={() => setFieldValue('check', !values.check)}
              />
              <View style={styles.buttonContainer}>
                <FormButton
                  buttonType="outline"
                  onPress={handleSubmit}
                  title="SIGNUP"
                  buttonColor="#F57C00"
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                />
              </View>
              <ErrorMessage errorValue={errors.general} />
            </>
          )}
        </Formik>
        <Button
          title="Have an account? Login"
          onPress={GoToLogin}
          titleStyle={{
            color: '#039BE5',
          }}
          type="clear"
        />
      </ScrollView>
    </KeyboardAvoidingView>
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

export default withFirebaseHOC(Signup);
