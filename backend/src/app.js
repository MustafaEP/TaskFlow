const express = require('express');
const cors = require('cors');

const app = express();

//Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());


// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/test", require("./routes/test.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/projects", require("./routes/project.routes"));
app.use("/api/tasks", require("./routes/task.routes"));

//Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'TaskFlow API çalışıyor' });
});

module.exports = app;