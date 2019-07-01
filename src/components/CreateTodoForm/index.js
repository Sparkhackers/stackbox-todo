import React, { useState } from 'react';
import styled from 'styled-components';
import { graphql, compose } from 'react-apollo';

import { EXECUTE_ACTION } from 'no-stack';

import { CREATE_TODO_FOR_PROJECT_ACTION_ID, CREATE_ISCOMPLETED_FOR_TODO_ACTION_ID } from '../../config';

const Form = styled.div`
  margin: 2em;
  padding: 1.5em;
  border: none;
  border-radius: 5px;
  background-color: #F5F5F5;
`;

const Button = styled.button`
  margin-left: 1em;
`;

function CreateTodoForm({ projectId, createTodo, createIsCompleted, onAdd }) {
  const [ todoName, updateTodoName ] = useState('');

  function handleChange(e) {
    updateTodoName(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!todoName) {
      return;
    }

    const createTodoResponse = await createTodo({
      variables: {
        actionId: CREATE_TODO_FOR_PROJECT_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: projectId,
          value: todoName,
        }),
        unrestricted: false,
      },
    });

    const newTodoData = JSON.parse(createTodoResponse.data.ExecuteAction);

    await createIsCompleted({
      variables: {
        actionId: CREATE_ISCOMPLETED_FOR_TODO_ACTION_ID,
        executionParameters: JSON.stringify({
          parentInstanceId: newTodoData.instanceId,
          value: 'false',
        }),
        unrestricted: false,
      },
      update: (cache, response) => {
        const isCompletedData = JSON.parse(response.data.ExecuteAction);

        const newTodo = {
          instance: {
            id: newTodoData.instanceId,
            value: newTodoData.value,
            __typename: 'Instance',
          },
          children: [
            {
              instance: {
                id: isCompletedData.instanceId,
                value: isCompletedData.value,
                __typename: 'Instance',
              },
              __typename: 'InstanceWithChildren',
            },
          ],
          __typename: 'InstanceWithChildren',
        };

        onAdd(newTodo)(cache);
      },
    });
  }

  function handleKeyPress(e) {
    if (e.charCode === 13) {
      handleSubmit(e);
    }
  }

  return (
    <Form>
      <label htmlFor='todo-name'>
        Todo Name:
        <input
          id='todo-name'
          type="text"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          value={todoName} />
      </label>
      <Button type="submit" onClick={handleSubmit}>Add Todo</Button>
    </Form>
  );
}

export default compose(
  graphql(EXECUTE_ACTION, { name: 'createTodo' }),
  graphql(EXECUTE_ACTION, { name: 'createIsCompleted' }),
)(CreateTodoForm);