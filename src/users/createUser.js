const dynamodb = require('@aws-sdk/client-dynamodb');
const ddbClient = new dynamodb.DynamoDBClient({ region: 'sa-east-1' });
const crypto = require('crypto');

exports.createUserHandler = async (event) => {
    let response;
    const tableName = process.env.USERS;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    const body = JSON.parse(event?.body);
    const name = body?.name;
    const email = body?.email;
    const password = body?.password;

    if(name && email && password) {

        let getEmailParams = {
            TableName: tableName,
            IndexName: 'user_email_index',
            KeyConditionExpression: 'user_email = :email',
            ExpressionAttributeValues: {   
                ':email' : { S: email }
            }
        }

        try {
            const emails = await ddbClient.send(new dynamodb.QueryCommand(getEmailParams));
            if(emails.Items.length > 0) {
                response = {
                    'statusCode': 200,
                    'body': JSON.stringify({message: "Email already in use"})
                };

            } else {
                let newUserParams = {
                    TableName: tableName,
                    Item: {
                        "user_id": {S: id},
                        "user_name": {S: name},
                        "user_email": {S: email},
                        "user_password": {S: password},
                        "user_created_at": {S: created_at}
                    }
                }

                const data = await ddbClient.send(new dynamodb.PutItemCommand(newUserParams));
                response = {
                    'statusCode': 200,
                    'body': JSON.stringify({
                        newUserInfo: {
                            "user_id": {S: id},
                            "user_name": {S: name},
                            "user_email": {S: email},
                            "user_created_at": {S: created_at}
                        }
                    })
                };
            }
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
                message: 'Name, email and password are required'
            })
        };
        return response;
    }
}