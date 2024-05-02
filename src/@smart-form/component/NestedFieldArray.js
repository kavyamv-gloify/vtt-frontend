/* eslint-disable */
import React from 'react';
import {useFieldArray} from 'react-hook-form';

export default ({nestIndex, control, register}) => {
  const {fields, remove, append} = useFieldArray({
    control,
    name: `test.${nestIndex}.nestedArray`,
  });

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <div key={item.id} style={{marginLeft: 20}}>
            <label>Nested Array:</label>
            <input
              {...register(`test.${nestIndex}.nestedArray.${k}.field1`, {
                required: true,
              })}
              defaultValue={item.field1}
              style={{marginRight: '25px'}}
            />

            <input
              {...register(`test.${nestIndex}.nestedArray.${k}.field2`)}
              defaultValue={item.field2}
            />
            <button id='btnMui123' type='button' onClick={() => remove(k)}>
              Delete Nested
            </button>
          </div>
        );
      })}

      <button
        id='btnMui123'
        type='button'
        onClick={() =>
          append({
            field1: 'field1',
            field2: 'field2',
          })
        }
      >
        Append Nested
      </button>

      <hr />
    </div>
  );
};
