import React, {useState, useEffect, useRef} from 'react';

const Practise = () => {
  const [name, setName] = useState();
  const [value, setValue] = useState();
  const [number, setNumber] = useState(0);
  const [previousValue, setPreviousValue] = useState();
  const prevName = usePrevious(name);

  useEffect(() => {
    if (prevName?.length && name?.length) {
      if (prevName !== name) {
        window.location.reload();
      }
    }
  }, [prevName, name]);
  return (
    <div>
      {/* <h1>Current Name {name}</h1> */}
      <input
        type='text'
        id='fname'
        name='fname'
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      {/* <button
        type='submit'
        onClick={() => {
          setName(value);
        }}
      >
        Submit
      </button> */}
      <h1>Current value {name}</h1>
      <h1>Previous Name: {prevName}</h1>
      <button
        onClick={() => {
          setName(value);
        }}
      >
        Click Me!!!
      </button>

      <div
        style={{
          textAlign: 'center',
          alignItems: 'center',
          margin: 'auto',
        }}
      >
        <h1 style={{color: 'green'}}>GeeksforGeeks</h1>
        <h3>React Example to excess previous state in Funtional components</h3>
        <h4>number: {number}</h4>
        <h4>previous number: {previousValue}</h4>
        {number !== previousValue && <p>Not same</p>}
        <button
          onClick={() =>
            setNumber((previous) => {
              setPreviousValue(previous);
              return previous + 1;
            })
          }
        >
          increment
        </button>
        <button
          onClick={() =>
            setNumber((previous) => {
              setPreviousValue(previous);
              return previous - 1;
            })
          }
        >
          decrement
        </button>
      </div>
    </div>
  );
};

export default Practise;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
