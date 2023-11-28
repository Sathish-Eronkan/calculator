import redis from 'redis';
const calculator = (num1, num2, operator) => {
    let result = 0;
    if(operator == '+')
        result = Number(num1) + Number(num2); 
    else if(operator == '-')
        result = Number(num1) - Number(num2);
    else if(operator == '*')
        result = Number(num1) * Number(num2);
    else 
        result = Number(num1) / Number(num2);
    return result;
}

const setData = async(result) => {
    try {
        const client = redis.createClient();
        client.on('error', err => console.log('Redis Client Error', err));
        await client.connect();
        console.log('clear ',process.env.clear);
        if(process.env.clear === 'true') {
            await resetData();
            process.env.clear = false;
        }
         
        let initialResult = await client.get('calculation');
        initialResult = initialResult ? JSON.parse(initialResult) : [];
        console.log('initialResult ',initialResult);
        initialResult.push(result);
        await client.set('calculation', JSON.stringify(initialResult));

        let initialOperations = await client.get('operations');
        initialOperations = initialOperations? Number(initialOperations) : 0;
        console.log('before addition ',initialOperations);
        initialOperations += 1;
        console.log('after addition ',initialOperations);
        await client.set('operations', JSON.stringify(initialOperations));

        client.quit();
        return initialOperations;
    } catch (err) {
        console.error('Error setting result:', err);
        client.quit();
    }
}

const updateData = async() => {
    try {
        const client = redis.createClient();
        client.on('error', err => console.log('Redis Client Error', err));
        await client.connect();
        let initialResult = await client.get('calculation');
        initialResult = JSON.parse(initialResult);
        console.log('initialResult ',initialResult);
        if(initialResult.length > 0) {
            initialResult.pop();
        }
        console.log('initialResult from update ',initialResult);
        await client.set('calculation', JSON.stringify(initialResult));

        let initialOperations = await client.get('operations');
        initialOperations = initialOperations > 0 ? Number(initialOperations) - 1 : 0;
        await client.set('operations', JSON.stringify(initialOperations));
        client.quit();
        return {
            value: initialResult.length > 0 ? initialResult[initialResult.length - 1] : '',
            totalOps: initialOperations
        }
    } catch (err) {
        console.error('Error updating result:', err);
        client.quit();
    }
    
}

const resetData = async() => {
    const client = redis.createClient();
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    await client.del('calculation');
    await client.del('operations');
    console.log('delete successfully')
    client.quit();
}

export {calculator, setData, updateData, resetData}