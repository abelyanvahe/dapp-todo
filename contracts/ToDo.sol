// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract ToDo {
    struct Task {
        uint256 id;
        string name;
        string content;
        string status;
    }

    Task[] public tasks;

    constructor() public {
        tasks.push(Task({
            id: 1,
            name: "Sample Task",
            content: "This is a sample task",
            status: "new"
        }));
    }
}
