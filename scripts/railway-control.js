import axios from 'axios';

/**
 * Railway Automation Script (API-based)
 * This bypasses the CLI and uses direct REST calls to manage projects and variables.
 */

const RAILWAY_API_URL = 'https://backboard.railway.app/graphql/v2';
const TOKEN = process.env.RAILWAY_TOKEN;

async function queryRailway(query, variables = {}) {
    try {
        const response = await axios.post(
            RAILWAY_API_URL,
            { query, variables },
            { headers: { Authorization: `Bearer ${TOKEN}` } }
        );
        return response.data;
    } catch (error) {
        console.error('Railway API Error:', error.response?.data || error.message);
        throw error;
    }
}

// Example: Get Project Info
async function getProjectStatus(projectId) {
    const query = `
        query project($id: String!) {
            project(id: $id) {
                name
                services {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
            }
        }
    `;
    return queryRailway(query, { id: projectId });
}

// Example: Set Environment Variable
async function setVariable(serviceId, environmentId, name, value) {
    const mutation = `
        mutation variableUpsert($name: String!, $value: String!, $serviceId: String!, $environmentId: String!) {
            variableUpsert(name: $name, value: $value, serviceId: $serviceId, environmentId: $environmentId)
        }
    `;
    return queryRailway(mutation, { name, value, serviceId, environmentId });
}

console.log('Railway Automation Module Initialized.');
