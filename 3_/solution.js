class TaskExecutor {
  constructor() {
    this.tasks = [];
    this.success = 0;
    this.fails = 0;
    this.time = 0;
  }

  async startTask(task) {
    this.tasks.push(task.id);

    const start = performance.now();
    try {
      await task.job();
      this.success += 1
    } catch(err) {
      this.fails += 1;
    }
    const taskTime = performance.now() - start;
    console.log(task.id, taskTime, this)
    this.time += taskTime;

    return this;
  }

  generateReport() {
    return {
      successCount: this.success,
      failedCount: this.fails,
      tasks: this.tasks,
      timeSpent: Math.ceil(this.time)
    }
  }
}

export class TaskManager {
  constructor(robotsCount) {
    this.queue = [];
    this.robots = Array.from({ length: robotsCount}, () => new TaskExecutor());
  }

  get queueLength() {
    return this.queue.length;
  }

  createTaskList(task) {
    return {
      priority: task.priority,
      tasks: [task]
    }
  }

  addToQueue(task) {
    for (let index in this.queue) {
      const taskList = this.queue[index];

      if (taskList.priority === task.priority) {
        taskList.tasks.push(task)
        return;
      }

      if (taskList.priority > task.priority) {
        this.queue.splice(index, 0, this.createTaskList(task))
        return;
      }
    }

    this.queue.push(this.createTaskList(task))
  }

  takeTask() {
    const taskList = this.queue[this.queueLength - 1];
    const task = taskList.tasks.pop();
    
    if (taskList.tasks.length === 0) {
      this.queue.pop();
    }

    return task;
  }

  *doTasks(workers) {
    const availableWorkers = [...workers]

    while (availableWorkers.length > 0) {
      const worker = availableWorkers.pop();
      const task = this.takeTask();

      worker.startTask(task)
        .then(() => {
          availableWorkers.push(worker)
        })
    }

    return 0;
  }

  async run() {
    const r = this.doTasks(this.robots);

    // while (this.queueLength > 0) {
     
    // }

    return this.robots.map(robot => robot.generateReport());
  }
}
