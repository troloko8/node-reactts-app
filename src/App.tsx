import React from 'react'
import { useQuery } from '@tanstack/react-query'

import logo from './logo.svg'
import './App.css'
import axios from 'axios'

// const fetchData = async () => {
//     const { data } = await axios.get('/api/data')
//     return data
// }
//FIXME write type
interface MyDataType {
    id: number
    name: string
}

const fetchData = async (): Promise<MyDataType[]> => {
    const { data } = await axios.get('https://api.example.com/data')
    return data
}

// const { data } = useQuery<MyDataType[]>(['data'], fetchData)

function App() {
    // const { data, error, isLoading } = useQuery(['data'], fetchData)
    const { data, error, isLoading } = useQuery<MyDataType[]>({
        queryKey: ['data'],
        queryFn: fetchData,
    })

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error loading data</p>

    console.log(data)
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    )
}

export default App

// API handling Approaches

// 1. React Query
// import { useQuery } from 'ßreact-query'
// import axios from 'axios'

// const fetchData = async () => {
//     const { data } = await axios.get('/api/data')
//     return data
// }

// const MyComponent: React.FC = () => {
//     const { data, error, isLoading } = useQuery('apiData', fetchData)

//     if (isLoading) return <p>Loading...</p>
//     if (error) return <p>Error loading data</p>

//     return <div>{data}</div>
// }

// 2. Axios with Custom Hooks - Traditional Approach with Flexibility
// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const useFetchData = (url: string) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(url);
//         setData(response.data);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [url]);

//   return { data, loading, error };
// };

// export default useFetchData;

// const MyComponent: React.FC = () => {
//   const { data, loading, error } = useFetchData('/api/data');

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return <div>{data}</div>;
// };
