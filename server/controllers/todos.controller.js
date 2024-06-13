const sql = require('../db.js');

exports.create = (req, res) => {
    const { title, completed } = req.body;

    const query = 'INSERT INTO todos (title, completed) VALUES (?, ?)';
    sql.query(query, [title, completed ? 1 : 0], (err, result) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        res.send({ id: result.insertId, title, completed });
    });
};

exports.findAll = (req, res) => {
    const query = 'SELECT * FROM todos';
    sql.query(query, (err, results) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        // completed 값을 boolean으로 변환
        const todos = results.map(todo => ({
            ...todo,
            completed: todo.completed === 1
        }));
        res.send(todos);
    });
};

exports.findAllCompleted = (req, res) => {
    const query = 'SELECT * FROM completed_todos ORDER BY completed_at DESC';
    sql.query(query, (err, results) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        res.send(results);
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    console.log(`Update request received for id: ${id}, title: ${title}, completed: ${completed}`);

    if (completed) {
        const deleteQuery = 'DELETE FROM todos WHERE id = ?';
        const insertQuery = 'INSERT INTO completed_todos (title) VALUES (?)';

        sql.query(deleteQuery, [id], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error('Database delete query error:', deleteErr);
                return res.status(500).send({ message: deleteErr.message });
            }
            sql.query(insertQuery, [title], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error('Database insert query error:', insertErr);
                    return res.status(500).send({ message: insertErr.message });
                }
                res.send({ message: 'Todo moved to completed_todos successfully' });
            });
        });
    } else {
        const query = 'UPDATE todos SET title = ?, completed = ? WHERE id = ?';
        sql.query(query, [title, completed ? 1 : 0, id], (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send({ message: err.message });
            }
            if (result.affectedRows === 0) {
                console.log('Error: Todo not found');
                return res.status(404).send({ message: 'Todo not found' });
            }
            console.log('Todo updated successfully');
            res.send({ message: 'Todo updated successfully' });
        });
    }
};

exports.delete = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM todos WHERE id = ?';
    sql.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        res.send({ message: 'Todo deleted successfully' });
    });
};
