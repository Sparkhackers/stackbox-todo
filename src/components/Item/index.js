import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 2em 1em;
  padding: 1.5em;
  border: none;
  border-radius: 10px;
  box-shadow: 5px 5px 10px #888888;
`;

const DoneItemDiv = styled.div`
  background-color: #FF6347;
  font-weight: bold;
  padding: 1.5em;
  margin: 1.5em auto;
  text-decoration: line-through;
  cursor: pointer;
  max-width: 200px;
`;

const Button = styled.button`
  margin-left: 1em;
`;

function Item({ id, name, done, onDelete }) {
  const [ itemName, updateItemName ] = useState(name);
  const [ itemDone, updateItemDone ] = useState(done);

  function handleChange(e) {
    updateItemName(e.target.value);
  }

  function handleKeyPress(e) {
    console.log(e.charCode);
  }

  function handleItemClick() {
    updateItemDone(!itemDone);
  }

  function handleDelete() {
    onDelete(id);
  }

  const inputFieldId = `item-name-${id}`

  const DeleteButton = () => (
    <Button
      type="button"
      onClick={handleDelete}
    >
      Remove
    </Button>
  );

  return (
    <Wrapper>
      <div>
        {itemDone ?
          (
            <DoneItemDiv onClick={handleItemClick}>
              {itemName}
              <DeleteButton />
            </DoneItemDiv>
          ) :
          (
            <div>
              <label htmlFor={inputFieldId}>
                Item Name:{' '}
                <input
                  id={inputFieldId}
                  type="text"
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  value={itemName}
                />
                  <Button type="button" onClick={handleItemClick}>
                    Done
                  </Button>
                  <DeleteButton />
              </label>
            </div>
          )
        }
      </div>
    </Wrapper>
  );
}

export default Item;
