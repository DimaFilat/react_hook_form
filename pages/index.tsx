import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';

import { FormData } from '../lib/types'

export default function Home() {
  const { register, handleSubmit, errors } = useForm<FormData>();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  return (
    <form
      onSubmit={handleSubmit(async (formData) => {
        setSubmitting(true);
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            terms: formData.terms,
          }),
        });
        const result = await response.json();

        if (result.errors) {
          setServerErrors(result.errors);
        } else {
          console.log('Success redirect to homepage');
        }

        setSubmitting(false);
      })}
    >
      {serverErrors && serverErrors.length !== 0 ? (
        <ul>
          {serverErrors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          ref={register({ required: 'required' })}
        />
        {errors.name ? <div>{errors.name.message}</div> : null}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          ref={register({ required: 'required' })}
        />
        {errors.email ? <div>{errors.email.message}</div> : null}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          ref={register({
            required: 'required',
            minLength: {
              value: 8,
              message: 'must be 8 chars',
            },
            validate: (value) => {
              return (
                [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
                  pattern.test(value)
                ) || 'must include lower, upper, number, and special characters'
              );
            },
          })}
        />
        {errors.password ? <div>{errors.password.message}</div> : null}
      </div>
      <div>
        <label htmlFor="terms">Your must agree to our terms</label>
        <input
          type="checkbox"
          name="terms"
          id="terms"
          ref={register({
            required: 'Your must agree to our terms',
          })}
        />
        {errors.terms ? <div>{errors.terms.message}</div> : null}
      </div>
      <div>
        <button disabled={submitting} type="submit">
          Registter
        </button>
      </div>
    </form>
  );
}
