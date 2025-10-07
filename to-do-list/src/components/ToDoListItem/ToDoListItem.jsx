import { Link } from 'react-router';
import './ToDoListItem.css';

const ToDoListItem = ({ data }) => {
    const {id, description, created_at, completed} = data;
    const formattedDate = new Date(Date.parse(created_at)).toLocaleDateString('en-GB');
    const completedClass = completed ? 'completed' : '';
    
    const now = new Date();
    const overdue = new Date(Date.parse(created_at)) < now && !completed;
    const overdueClass = overdue && !completed? 'overdue' : '';
    
    const completedClassCombined = `${completedClass} ${overdueClass}`.trim();

    const completed_str = completed ? 'Completed Task' : <Link to={`/edit/${id}`} className="edit-link">Edit</Link>;
    
    return (
        <tr>
            <td className={completedClassCombined}>{description}</td>
            <td className={completedClassCombined}>{formattedDate}</td>
            <td>{completed_str}</td>
        </tr>
    )
}

export default ToDoListItem;

