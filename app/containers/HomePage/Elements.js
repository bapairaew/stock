import React from 'react';
import styled from 'styled-components';
import { Card, Form } from 'antd';

const _Form = Form;
export const StyledForm = styled(_Form)`
  width: 980px;
  margin: 30px auto;
`;

export const CardContainer = styled.div`
  margin: 0 auto;
  max-width: 1080px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  height: 530px;
  justify-content: center;
`;

const _Card = ({ ...props }) => (
  <Card {...props} style={{ width: 300 }} bodyStyle={{ padding: 0, height: '100%' }} />
);
export const StyledCard = styled(_Card)`
  margin: 20px;
  max-height: 200px;
`;

export const Body = styled.div`
  display: flex;
  height: 100%;
  background: ${props => props.value === 0 ? '#bbb' : props.value > 0 ? '#8bc34a' : '#f44336'};
  color: rgba(255,255,255,.9);
`;

export const Details = styled.div`
  padding: 20px;
  width: 180px;
`;

export const H1 = styled.h1`
  font-weight: 900;
  font-size: 22px;
`;

export const H2 = styled.h2`
  font-weight: 100;
  font-size: 16px;
  color: rgba(255,255,255,.7);
`;

export const H3 = styled.h3`
  font-weight: 100;
  font-size: 14px;
  color: rgba(255,255,255,.7);
`;

export const Number = styled.p`
  font-size: 35px;
`;

export const Remaining = styled.div`
  background: rgba(0,0,0,.1);
  width: 120px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 0 6px rgba(0,0,0,.3);
`;
