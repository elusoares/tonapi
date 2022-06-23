const axios = require('axios').default;

exports.getKeyValueHandler = async (event) => {
    const URL = process.env.COUNT_API_URL;
    const ENDPOINT = process.env.COUNT_API_GET_ENDPOINT;
    const NAMESPACE = process.env.COUNT_API_NAMESPACE;
    const KEY = process.env.COUNT_API_KEY;
    
    try {
        let axiosResponse = await axios.get(`${URL}${ENDPOINT}${NAMESPACE}${KEY}`);
        let response = {
            'statusCode': 200,
            'body': JSON.stringify({
                currentCounterValue: axiosResponse.data?.value
            })
        };

        return response;
    } catch (error) {
        let response = {
            'statusCode': 502,
            'body': JSON.stringify(error?.message)
        };
        return response;
    }
}