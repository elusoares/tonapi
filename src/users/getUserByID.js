const dynamodb = require('@aws-sdk/client-dynamodb');
const ddbClient = new dynamodb.DynamoDBClient({ region: 'sa-east-1' });

exports.getUserByIDHandler = async (event) => {
    let response;
    const userID = event.pathParameters.id;
    const tableName = process.env.USERS;

    if(userID) {
        let params = {
            TableName: tableName,
            Key: {
                'user_id': {S: userID},
            },
            ProjectionExpression: 'user_name, user_email, user_created_at',
        };

        try {
            const data = await ddbClient.send(new dynamodb.GetItemCommand(params));
            response = {
                'statusCode': 200,
                'body': JSON.stringify(data.Item)
            };
            return response;
        } catch (error) {
            response = {
                'statusCode': 502,
                'body': error
            };
            return response;
        }
    } else {
        response = {
            'statusCode': 400,
            'body': JSON.stringify({
                message: 'You must provide a user ID'
            })
        };
        return response;
    }

}