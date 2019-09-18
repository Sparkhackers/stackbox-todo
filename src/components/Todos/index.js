import React from 'react';
import styled from 'styled-components';
import { Source } from '@nostack/no-stack';

import Todo from '../Todo';
import CreateTodoForm from '../CreateTodoForm';

import {SOURCE_TO_DO_SOURCE_ID} from "../../config";
import {TODOS_FOR_CURRENT_PROJECT_RELATIONSHIPS, TODOS_FOR_CURRENT_PROJECT_SOURCE_QUERY} from "../source-props/todo";

const TodoListStyleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
`;

function Todos({ projectId }) {
  const parameters = {
    currentProjectId: projectId,
  };

  return (
    <Source
      id={SOURCE_TO_DO_SOURCE_ID}
      query={TODOS_FOR_CURRENT_PROJECT_SOURCE_QUERY}
      typeRelationships={TODOS_FOR_CURRENT_PROJECT_RELATIONSHIPS}
      parameters={parameters}
    >
      {({loading, error, data, updateSourceAfterCreateAction, updateSourceAfterUpdateAction, updateSourceAfterDeleteAction }) => {
        if (loading) return 'Loading...';

        if (error) return `Error: ${error.graphQLErrors}`;

        const todos = data.unitData.map(el => ({
          ...el.instance,
          isCompleted: el.children[0].instances[0].instance,
        }));

        return (
          <>
            <CreateTodoForm projectId={projectId} onAdd={updateSourceAfterCreateAction} />
            <TodoListStyleWrapper>
              {
                todos && todos.map(todo => (
                  <Todo
                    key={todo.id}
                    todo={todo}
                    projectId={projectId}
                    isCompleted={todo.isCompleted}
                    onUpdate={updateSourceAfterUpdateAction}
                    onDelete={updateSourceAfterDeleteAction}
                  />
                ))
              }
            </TodoListStyleWrapper>
          </>
        );
      }}
    </Source>
  );
}


export default Todos;
