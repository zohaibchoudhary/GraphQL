import { gql, useQuery } from '@apollo/client';
import './App.css'

const query = gql`
    query getTodosWithUser {
      getTodos {
        id
        title
        completed
        user {
          id
          username
        }
      }
    }
  `

function App() {

  const {data, loading} = useQuery(query)

  if (loading) <h1>Loading...</h1> 
  return (
    <>
    <table>
      <tbody>
        {data && data.getTodos.map((todo) => (
          <tr key={todo.id}>
            <td>{todo.title}</td>
            <td>{todo.user?.username}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  )
}

export default App
