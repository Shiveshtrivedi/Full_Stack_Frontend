import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getCart } from '../redux/slices/cartSlice';

const ContactContainer = styled.div`
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px #00000050;
  max-width: 600px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  resize: vertical;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ContactPage: React.FC = () => {
  const userId = useSelector((root: RootState) => root.auth.user.id);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getCart({ userId }));
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    toast.success('Message sent successfully!');
    reset();
  };

  return (
    <ContactContainer>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p>{errors.name.message?.toString()}</p>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p>{errors.email.message?.toString()}</p>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            type="text"
            {...register('subject', { required: 'Subject is required' })}
          />
          {errors.subject && <p>{errors.subject.message?.toString()}</p>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="message">Message</Label>
          <TextArea
            id="message"
            rows={5}
            {...register('message', { required: 'Message is required' })}
          />
          {errors.message && <p>{errors.message.message?.toString()}</p>}
        </FormGroup>

        <SubmitButton type="submit">Send Message</SubmitButton>
      </form>
    </ContactContainer>
  );
};

export default ContactPage;
