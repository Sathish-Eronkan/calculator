import {calculator, setData, updateData, resetData} from '../utils/utils.js';
import redis from 'redis';
const setValues = async (req, res) => {
    try {
        console.log('req ',req.body);
        let num1 = req.body.num1;
        let num2 = req.body.num2;
        let operator = req.body.operator;
        let result = calculator(num1, num2, operator);
        console.log('result from setValues ',result);
        let totalOps = await setData(result);
        res.status(200).json({
          result,
          totalOps
        });
    } catch (err) {
        console.log('Error setting result:',err);
    }
}

const setOperations = async (req,res) => {
  try {
        console.log('inside set operation');
        const client = redis.createClient();
        client.on('error', err => console.log('Redis Client Error', err));
        await client.connect();
        let initialResult = await client.get('calculation');
        initialResult = JSON.parse(initialResult);
        console.log('req ',req.body);
        let num1 = req.body.num;
        let num2 = initialResult[initialResult.length - 1];
        let operator = req.body.operator;
        let result = calculator(num1, num2, operator);
        console.log('result from setOperations ',result);
        let totalOps = await setData(result);
        res.status(200).json({
          result,
          totalOps
        });
    } catch (err) {
        console.log('Error updating result:',err);
    }
}

const updateCalculator = async (req, res) => {
    try {
        const result = await updateData();
        res.status(200).json({
          result: result.value,
          totalOps: result.totalOps
        });
    } catch (err) {
        console.error('Error undo calculator:', err);
  }
}

const resetCalculator = async (req,res) => {
    try {
        await resetData();
        res.status(200).json({
          success: true,
          message: 'Calculator is now reset'
        });
    } catch (err) {
        console.log('Error reset Calculator:',err);
    }
}

export {setValues, setOperations, updateCalculator, resetCalculator};