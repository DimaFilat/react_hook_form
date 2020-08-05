import { NextApiRequest, NextApiResponse } from 'next';

import { FormData } from '../../lib/types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const formData: FormData = req.body;
  const errors = await validateData(formData);

  const human = await validateHuman(formData.token);
  if (!human) {
    res.status(400);
    res.json({ errors: [`Please, you're not fooling us, bot.`] });
    return;
  }

  if (errors.length > 0) {
    res.status(400);
    res.json({ errors });
  }

  res.status(201);
  res.json({ message: 'Success!' });
};

async function validateData(formData: FormData): Promise<string[]> {
  const errors: string[] = [];
  const emails = ['used@email.com'];

  if (emails.includes(formData.email)) {
    errors.push('Email already is used');
  }

  return errors;
}

async function validateHuman(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/` +
      `filatchevcaptcha?secret=${secret}&response=${token}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  const result = await response.json();

  return result.sucess;
}
