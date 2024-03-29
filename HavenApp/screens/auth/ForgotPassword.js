import React from 'react';
import { Text, SafeAreaView, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FormButton, FormInput, ErrorMessage } from '../../components/';
import { withFirebaseHOC } from '../../config/';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label('Email')
    .email('Enter a valid email')
    .required('Please enter a registered email'),
});

const ForgotPassword = (props) => {
  const GoToLogin = () => {
    return props.navigation.navigate('Login');
  };

  const PasswordResetHandler = async (values, actions) => {
    const { email } = values;
    try {
      await props.firebase.passwordReset(email);
      console.log('Password reset email sent successfully');
      props.navigation.navigate('Login');
    } catch (error) {
      actions.setFieldError('general', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Forgot Password?</Text>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={(values, actions) => {
          PasswordResetHandler(values, actions);
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
            <View style={styles.buttonContainer}>
              <FormButton
                buttonType="outline"
                onPress={handleSubmit}
                title="Send Email"
                buttonColor="#039BE5"
                disabled={!isValid || isSubmitting}
              />
            </View>
            <ErrorMessage errorValue={errors.general} />
          </>
        )}
      </Formik>
      <Button
        title="Go back"
        onPress={GoToLogin}
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
    marginTop: 150,
  },
  text: {
    color: '#333',
    fontSize: 24,
    marginLeft: 25,
  },
  buttonContainer: {
    margin: 25,
  },
});

export default withFirebaseHOC(ForgotPassword);
