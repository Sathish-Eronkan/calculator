import { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
const CreateScreen = () => {

  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [num3, setNum3] = useState('');
  const [operator, setOperator] = useState('');
  const [totalOps, setTotalOps] = useState('');
  const [result, setResult] = useState('');
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log('result ',result);
      console.log('num3 ',num3);
      let value;
      if(result) {
        const {data} = await axios.post('/api/operation', {
          num: num3,
          operator
        });
        value = data;
      } else {
        const {data} = await axios.post('/api/init', {
          num1: num1,
          num2: num2,
          operator
        });
        value = data;
      }
      setTotalOps(value.totalOps);
      setResult(value.result);
      setNum1('');
      setNum2('');
      setNum3('');
      setOperator('');
      console.log('data from submit ',value);
    } catch (err) {
        console.log('err ',err);
    }
  };

  const undoHandler = async() => {
    try {
        const {data} = await axios.put('/api/undo', {
            num1: result,
            num2,
            operator
        });
        console.log('data from undoHandler ',data);
        setTotalOps(data.totalOps);
        setResult(data.result);
        console.log('result after update ',data);

    } catch (err) {
        console.log('err ',err);
    }
  }

  const resetHandler = async() => {
    try {
        await axios.get('/api/reset');
        setNum1('');
        setNum2('');
        setNum3('');
        setOperator('');
        setTotalOps('');
        setResult('');
    } catch (err) {
        console.log('err ',err);
    }
  }

  return (
    <FormContainer>
        <h1>Set Values</h1>
        <Form onSubmit={submitHandler}>
            {(totalOps && totalOps > 0) ? (
                 <Form.Group className='my-2' controlId='num'>
                <Form.Label>Number</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter Number'
                    value={num3}
                    required
                    onChange={(e) => setNum3(e.target.value)}
                ></Form.Control>
                </Form.Group>
            ) : (
                <div>
                    <Form.Group className='my-2' controlId='num1'>
                    <Form.Label>Number 1</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter Number 1'
                        value={num1}
                        required
                        onChange={(e) => setNum1(e.target.value)}
                    ></Form.Control>
                    </Form.Group>

                    <Form.Group className='my-2' controlId='num2'>
                    <Form.Label>Number 2</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter Number 2'
                        value={num2}
                        required
                        onChange={(e) => setNum2(e.target.value)}
                    ></Form.Control>
                    </Form.Group>
                </div>
            )}
            

            <Form.Group className='my-2' controlId='operator'>
            <Form.Label>Operator</Form.Label>
            <Form.Control
                type='text'
                placeholder='Enter Operator'
                value={operator}
                required
                onChange={(e) => setOperator(e.target.value)}
            ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='operator'>
            <Form.Label>Result</Form.Label>
            <Form.Control
                type='text'
                placeholder='result'
                value={result}
                readOnly
            ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='operator'>
            <Form.Label>Total Operations</Form.Label>
            <Form.Control
                type='text'
                placeholder='result'
                value={totalOps}
                readOnly
            ></Form.Control>
            </Form.Group>

            <div className="my-2">
              <Button type='submit' style={{ marginRight: '10px' }} variant='primary'>
                Calculate
              </Button>
              <Button type='button' variant='primary' style={{ marginRight: '10px' }} onClick={undoHandler}>
                Undo
              </Button>
              <Button type='button' variant='primary' style={{ marginRight: '10px' }} onClick={resetHandler}>
                Reset
              </Button>
              
            </div>
        </Form>
    </FormContainer>
  ) 
};

export default CreateScreen;
