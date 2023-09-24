import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import PasswordInput from '../Form-Input/PasswordInput';
import TextInput from '../Form-Input/TextInput';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addSignUpFormData,
  login,
  resetSignIn,
  triggerSignin,
} from '../../Features/auth/auth_slice';
import MainButton from '../Molecules/MainButton';
import { ToastContainer, toast } from 'react-toastify';

// this component is used for both signup and login

const LoginForm = ({ forLogin, regFirstStep }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const validationSchema = Yup.object().shape({
    Email: Yup.string().email('Invalid email address').required('Required'),
    Password: Yup.string()
      .required('Required')
      .matches(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/,
        'Must contain at least one number, one uppercase letter, and one special character'
      ),
  });

  const handleSubmit = (values) => {
    if (forLogin) {
      dispatch(triggerSignin(values));
    } else {
      dispatch(addSignUpFormData(values));
      regFirstStep(true);
    }
  };
  const notify = () => toast('Invalid password');
  useEffect(() => {
    if (auth.signin.status === 'successful') {
      if (auth.signin.data === 'Invalid password') {
        resetSignIn();
        notify();
      }
      if (auth.signin.data?.token) {
        dispatch(login(true));
      }
    }
  }, [auth.signin.status]);
  return (
    <>
      <Formik
        initialValues={{
          Email: '',
          Password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className='form-card mx-lg-0 mx-auto'>
          <div>
            <header>
              {forLogin ? (
                <>
                  <h2>Log In</h2>
                  <div>
                    Please login to your membership account using the form
                    below.
                  </div>
                </>
              ) : (
                <>
                  <h2>Sign up</h2>
                  <div>
                    Create an account today to begin your free membership!
                  </div>
                </>
              )}
            </header>

            <TextInput
              name='Email'
              label='Email'
              type='email'
              placeholder='Input your email here'
            />
            <PasswordInput
              name='Password'
              label='Password'
              placeholder='Input your password here'
            />

            {forLogin && (
              <Link to='/forgot-password' className='other-action-btn mt-3'>
                Forgot Password?
              </Link>
            )}
          </div>

          <div className='text-center'>
            <div className='btn-wrapper'>
              {forLogin ? (
                <MainButton
                  text={'Log in'}
                  width={'25.5rem'}
                  loading={auth.signin.status === 'loading'}
                />
              ) : (
                <MainButton
                  text={'Sign up'}
                  width={'25.5rem'}
                  loading={auth.signin.status === 'loading'}
                />
              )}
            </div>

            <div className='mt-3 next-action-text'>
              {forLogin ? (
                <>
                  <span>Don't have an account?</span>{' '}
                  <span>
                    <Link to='/register'>Sign Up</Link>
                  </span>
                </>
              ) : (
                <>
                  <span>Already have an account?</span>{' '}
                  <span>
                    <Link to='/login'>Log in</Link>
                  </span>
                </>
              )}
            </div>
          </div>
        </Form>
      </Formik>
      <ToastContainer />
    </>
  );
};

export default LoginForm;
