import { Link } from 'react-router';
import './ToDoListItem.css';

const ToDoListItem = ({ data }) => {
    const {_id, todoDescription, todoDateCreated, todoCompleted} = data;
    const formattedDate = new Date(Date.parse(todoDateCreated)).toLocaleDateString('en-GB');
    const completedClass = todoCompleted ? 'completed' : '';
    
    const now = new Date();
    const overdue = new Date(Date.parse(todoDateCreated)) < now && !todoCompleted;
    const overdueClass = overdue && !todoCompleted? 'overdue' : '';
    
    const completedClassCombined = `${completedClass} ${overdueClass}`.trim();

    const completed = todoCompleted ? 'Completed Task' : <Link to={`/edit/${_id}`} className="edit-link">Edit</Link>;
    
    return (
        <tr>
            <td className={completedClassCombined}>{todoDescription}</td>
            <td className={completedClassCombined}>{formattedDate}</td>
            <td>{completed}</td>
        </tr>
    )
}

export default ToDoListItem;

