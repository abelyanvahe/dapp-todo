class App {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadWeb3();
        await this.loadContract();
        await this.fetchTasks();
        this.addEventListeners();
    }

    async loadWeb3() {
        if (typeof window.ethereum == 'undefined') {
            console.log('MetaMask is not installed');
        } else {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                this.account = accounts[0];
                this.web3 = new Web3();
                this.web3.currentProvider = window.ethereum;
            } catch (error) {
                console.log('User did not give access');
            }
        }
    }

    async loadContract() {
        const todoABI = await $.getJSON('/contracts/ToDo.json');
        const contract = new this.web3.eth.Contract(todoABI.abi, '0xb6E786e0180d4D7D720f23290562c52Ee70CaaA4');
        this.contract = contract;
    }

    async fetchTasks() {
        const taskCount = await this.contract.methods.getTaskCount().call();
        const tasks = [];
        for (let index = 0; index < taskCount; index++) {
            const task = await this.contract.methods.tasks(index).call();
            tasks.push(task);
        }
        this.tasks = tasks;
        this.renderTasks();
    }

    addEventListeners() {
        $(".addTask form").on("submit", async (e) => {
            e.preventDefault();
            const name = $("form input[name=name]").val();
            const content = $("form textarea[name=content]").val();
            console.log('name', name, content);
            await this.contract.methods.addTask(name, content).send({
                from: this.account,
                value: 1
            });
            await this.fetchTasks();
        })
    }

    renderTasks() {
        $('#tasks .list').html('');
        this.tasks.map(task => {
            const taskLi = $('<div>').addClass('task');
            $(taskLi).html(`<span class="name">${task.name}</span>
                <p class="content">${task.content}</p>
                <span>${task.status}</span>`);
            $('#tasks .list').append(taskLi);
        })
    }
}

$(document).ready(function () {
    const app = new App();
});