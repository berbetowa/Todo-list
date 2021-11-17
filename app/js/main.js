var toDoList = function () { };

toDoList.prototype = {
    /**
     * Set array in localStorage
     *
     * @param {Array} lists
     */
    setLists: function (lists) {
        localStorage.setItem('lists', JSON.stringify(lists));
    },

    /**
     * Get array from localStorage
     */
    getLists: function () {
        return JSON.parse(localStorage.getItem('lists'));
    },

    /**
     * Remove object 'lists' from array
     *
     * @param {string} this
     */
    removeList: function (self) {
        let item = self.closest('.todo-list__content--item'),
            index = parseInt(item.querySelector('.todo-list__content--title').getAttribute('data-id')),
            listRemoved = this.getLists();
        if (confirm("Are you sure you want to remove this list?")) {

            listRemoved.splice(this.getIndex(index), 1);
            this.setLists(listRemoved);

            item.remove();
        }
    },

    /**
     * Create new 'lists' object in array
     */
    setNewList: function () {
        let listCreated = this.getLists(),
            lastIndex = 0,
            idNumber = 0;

        if (listCreated.length) {
            lastIndex = listCreated.length;
            idNumber = ++this.getLastIdList().id;
        }

        listCreated.push({ name: 'List' + idNumber, id: idNumber, items: [] });
        this.setLists(listCreated);

        this.createnewList(listCreated[lastIndex].name, idNumber);
    },

    /**
     * Get last id-number from the 'list' object in array
     *
     * @return {number} 
     */
    getLastIdList: function () {
        let listCreated = this.getLists();

        let max = listCreated.reduce(function (prev, current) {
            if (+current.id > +prev.id) {
                return current;
            } else {
                return prev;
            }
        });

        return max;
    },

    /**
     * Get last id-number from the item in 'list' object in array
     *
     * @param {number} index
     * @return {number}
     */
    getLastId: function (index) {
        let listCreated = this.getLists();

        let max = listCreated[index].items.reduce(function (prev, current) {
            if (+current.id > +prev.id) {
                return current;
            } else {
                return prev;
            }
        });

        return max;
    },

    /**
     * Get state of the 'list' objects and 'item' arrays in it 
     */
    getState: function () {
        let listCreated = this.getLists(),
            that = this

        listCreated.map(function (list) {
            that.createnewList(list.name, list.id);
            list.items.map(function (item) {
                that.getNewListItem(item.name, item.id, item.status, item.canceled);
            })
        });
    },

    /**
     * Rename'list' object in array
     *
     * @param {string} self
     */
    getListNameEdit: function (self) {

        let that = this;

        let editIconParent = self.closest('.todo-list__content--title'),
            saveButton = editIconParent.querySelector('.save-icon');

        editIconParent.querySelector('.todo-list__content--name').style.pointerEvents = 'all';
        editIconParent.querySelector('.todo-list__content--name').focus();
        self.style.display = 'none';
        saveButton.style.display = 'inline-block';

        saveButton.addEventListener('click', function (e) {
            e.stopPropagation();

            let title = this.closest('.todo-list__content--title'),
                index = parseInt(title.getAttribute('data-id')),
                inputValue = title.querySelector('.todo-list__content--name').value,
                listCreated = that.getLists();

            listCreated[that.getIndex(index)].name = inputValue;
            that.setLists(listCreated);

            this.style.display = 'none';
            title.querySelector('.edit-icon').style.display = 'inline-block';
            title.querySelector('.todo-list__content--name').style.pointerEvents = 'none';
        });
    },

    /**
     * Get index of the 'list' object in array
     *
     * @param {number} id
     * @return {number}
     */
    getIndex: function (id) {
        let index = false,
            listCreated = this.getLists();

        listCreated.forEach(function (item, i) {
            if (item.id === id) {
                index = i
            }
        });
        return index;
    },

    /**
     * Get index of the 'item' array in 'list' object
     *
     * @param {number} listId
     * @param {number} itemId
     * @return {number}
     */
    getItemsIndex: function (listId, itemId) {
        let index = false,
            listCreated = this.getLists();

        listCreated[listId].items.forEach(function (item, i) {
            if (item.id === itemId) {
                index = i
            }
        });
        return index;
    },

    /**
     * Add new 'list' object in array
     *
     * @param {string} self
     */
    addNewListItem: function (self) {

        let list = self.closest('.todo-list__content--list'),
            title = list.closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
            id = parseInt(title.getAttribute('data-id')),
            that = this,
            listCreated = that.getLists(),
            index = that.getIndex(id),
            idNumber = 0;

        if (listCreated[index].items.length) {
            idNumber = ++that.getLastId(index).id;
        }

        list.append(that.createNewListItem('Item' + idNumber, idNumber));

        listCreated[index].items.push({ name: 'Item' + idNumber, id: idNumber, status: false, canceled: false });

        that.setLists(listCreated);

        that.getStatistic();
    },

    /**
     * Restore html of the 'list' object after page reloadig
     *
     * @param {string} name
     * @param {number} id
     * @param {boolean} status
     * @param {boolean} canceled
     */
    getNewListItem: function (name, id, status, canceled) {
        let listsParent = document.querySelector('.todo-list__content--items'),
            lists = listsParent.querySelectorAll('.todo-list__content--item'),
            list = lists[lists.length - 1];

        list.querySelector('.todo-list__content--list').append(this.createNewListItem(name, id, status, canceled));
    },

    /**
     * hange boolean status in 'status'-param in 'item' array
     *
     * @param {string} self
     */
    changeStatus: function (self) {
        let item = self.closest('.todo-list__content--list__item'),
            itemId = parseInt(item.getAttribute('data-id')),
            title = item.closest('.todo-list__content--list').closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
            listId = parseInt(title.getAttribute('data-id')),
            listCreated = this.getLists(),
            indexItem = this.getItemsIndex(listId, itemId),
            indexList = this.getIndex(listId);

        listCreated[indexList].items[indexItem].status = !listCreated[indexList].items[indexItem].status;

        this.setLists(listCreated);

        this.getStatistic();
    },

    /**
     * Remove 'item' array from the 'list' object
     *
     * @param {string} self
     */
    removeItem: function (self) {
        let item = self.closest('.todo-list__content--list__item'),
            itemId = parseInt(item.getAttribute('data-id')),
            title = item.closest('.todo-list__content--list').closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
            listId = parseInt(title.getAttribute('data-id')),
            indexItem = this.getItemsIndex(listId, itemId),
            indexList = this.getIndex(listId),
            listRemoved = this.getLists();
        if (confirm("Are you sure you want to remove this task?")) {
            listRemoved[indexList].items.splice(indexItem, 1);
            this.setLists(listRemoved);

            item.remove();

            this.getStatistic();
        }
    },

    /**
     * Change 'item' array's name-param 
     *
     * @param {string} self
     */
    getItemsNameEdit: function (self) {
        let that = this;
        let item = self.closest('.todo-list__content--list__item'),
            saveButton = item.querySelector('.item__save-icon');

        item.querySelector('.todo-list__content--text').style.pointerEvents = 'all';
        item.querySelector('.todo-list__content--text').focus();
        self.style.display = 'none';
        saveButton.style.display = 'inline-block';

        saveButton.addEventListener('click', function () {
            let item = this.closest('.todo-list__content--list__item'),
                itemId = parseInt(item.getAttribute('data-id')),
                title = item.closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
                listId = parseInt(title.getAttribute('data-id')),
                indexItem = that.getItemsIndex(listId, itemId),
                indexList = that.getIndex(listId),
                listCreated = that.getLists(),
                inputValue = item.querySelector('.todo-list__content--text').value;

            listCreated[indexList].items[indexItem].name = inputValue;
            that.setLists(listCreated);

            this.style.display = 'none';
            item.querySelector('.todo-list__content--text').style.pointerEvents = 'none';
            item.querySelector('.item__edit-icon').style.display = 'inline-block';
        });
    },


    /**
     * Change boolean status in 'canseld'-param in 'item' array into true
     *
     * @param {string} self
     */
    cancellationOfTheTask: function (self) {
        let item = self.closest('.todo-list__content--list__item'),
            itemId = parseInt(item.getAttribute('data-id')),
            title = item.closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
            listId = parseInt(title.getAttribute('data-id')),
            that = this,
            listCreated = that.getLists(),
            indexItem = that.getItemsIndex(listId, itemId),
            indexList = that.getIndex(listId);

        item.classList.add('_canceled');

        listCreated[indexList].items[indexItem].canceled = true;

        that.setLists(listCreated);

        that.getStatistic();
    },

    /**
     * Change boolean status in 'canseld'-param in 'item' array into false
     *
     * @param {string} self
     */
    returnTask: function (self) {
        let item = self.closest('.todo-list__content--list__item'),
            itemId = parseInt(item.getAttribute('data-id')),
            title = item.closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
            listId = parseInt(title.getAttribute('data-id')),
            that = this;
        listCreated = that.getLists(),
            indexItem = that.getItemsIndex(listId, itemId),
            indexList = that.getIndex(listId);

        item.classList.remove('_canceled');

        listCreated[indexList].items[indexItem].canceled = false;

        that.setLists(listCreated);

        that.getStatistic();
    },

    /**
     * Create new 'item' array
     *
     * @param {string} name
     * @param {number} id
     * @param {boolean} status
     * @param {boolean} canseled
     * @return {string}
     */
    createNewListItem: function (name, id, status, canceled) {
        let checked = '',
            canceledClass = '',
            that = this;
        if (status) {
            checked = 'checked';
        }

        if (canceled) {
            canceledClass = ' _canceled';
        } else {
            canceledClass;
        }

        let newListItem = document.createElement('div');
        newListItem.className = 'todo-list__content--list__item' + canceledClass;
        newListItem.innerHTML = '<input class="todo-list__content--checker" ' + checked + ' type="checkbox">' +
            '<input class="todo-list__content--text" type="text" value="' + name + '"/>' +
            '<img class="item__save-icon"  src="images/save.png" alt="save icon">' +
            '<img class="item__edit-icon" src="images/edit-icon.svg" alt="edit-icon">' +
            '<img class="item__canceled-icon" src="images/remove-icon.svg" alt="canceled icon">' +
            '<img class="item__return-icon" src="images/return.png" alt="return icon">' +
            '<img class="item__remove-icon" src="images/delete.png" alt="remove icon">';

        newListItem.setAttribute('data-id', id);

        newListItem.querySelector('.todo-list__content--checker').addEventListener('change', function () {
            that.changeStatus(this);
        });
        newListItem.querySelector('.item__remove-icon').addEventListener('click', function () {
            that.removeItem(this);
        });
        newListItem.querySelector('.item__edit-icon').addEventListener('click', function () {
            that.getItemsNameEdit(this);
        });
        newListItem.querySelector('.item__canceled-icon').addEventListener('click', function () {
            that.cancellationOfTheTask(this);
        });
        newListItem.querySelector('.item__return-icon').addEventListener('click', function () {
            that.returnTask(this);
        });

        return newListItem;
    },

    /**
     * Create new 'list' object
     *
     * @param {string} name
     * @param {number} inumber
     */
    createnewList: function (name, number) {
        let $lists = document.querySelector('.todo-list__content--items'),
            newList = document.createElement('div'),
            that = this;

        newList.className = 'todo-list__content--item';
        newList.innerHTML = ' <div data-id="' + number + '" class="todo-list__content--title">' +
            '<div>' +
            '<a class="remove-icon" href="#"> <img class="remove-icon__img" src="images/delete.png" alt="remove icon"></a>' +
            '<img class="save-icon"  src="images/save.png" alt="save icon">' +
            '<input class="todo-list__content--name" type="text" value="' + name + '" />' +
            ' <img class="edit-icon" src="images/pencil.png" alt="edit-icon">' +
            '</div>' +
            '<img class="arrow-down" src="images/down-arrow.png" alt="arrow down">' +
            ' </div>' +
            ' <div class="todo-list__content--list">' +
            ' <a class="add-icon" href="#"> <img src="images/add-icon.svg" alt="add icon"><span>Add new list item</span></a>' +
            '</div > ';

        newList.querySelectorAll('.todo-list__content--title').forEach((item) =>
            item.addEventListener('click', (e) => {
                e.preventDefault();
                item.closest('.todo-list__content--item')
                    .classList.toggle('todo-list__content--item__active')
            })
        );

        newList.querySelector('.remove-icon').addEventListener('click', function (e) {
            e.preventDefault();
            that.removeList(this);
        });

        newList.querySelector('.edit-icon').addEventListener('click', function (e) {
            e.stopPropagation();
            that.getListNameEdit(this);
        });
        newList.querySelector('.add-icon').addEventListener('click', function (e) {
            e.preventDefault();
            that.addNewListItem(this);
        });
        $lists.append(newList);
    },

    /**
     * ToDo List initialisation
     */
    init: function () {
        let that = this;
        if (!localStorage.getItem('lists')) {
            that.setLists([]);
        }
        that.getState();
        that.getStatistic();

        document.querySelector('.todo-list__content--link')
            .addEventListener('click', function (e) {
                e.preventDefault();
                that.setNewList();
            });
    },

    /**
     * Calculate and show Statistics
     */
    getStatistic: function () {
        let listCreated = this.getLists(),
            done = 0,
            canceled = 0,
            inProgress = 0,
            count = 0,
            listCount = 0,
            listCompleted = 0;


        listCreated.map(function (list) {
            listCount++;
            let itemDone = 0;
            list.items.map(function (item) {
                count++;

                if (item.status) {
                    itemDone++;
                    done++;

                } else if (item.canceled) {
                    itemDone++;
                    canceled++;
                } else {
                    inProgress++;
                }
            })
            if (list.items.length === itemDone) {
                listCompleted++;
            }
        });

        done = Math.round(done * 100 / count) || 0;
        inProgress = Math.round(inProgress * 100 / count) || 0;
        canceled = Math.round(canceled * 100 / count) || 0;
        listCompleted = Math.round(listCompleted * 100 / listCount) || 0;

        document.querySelector('.done-statistic').innerHTML = done + '%';
        document.querySelector('.inprogress-statistic').innerHTML = inProgress + '%';
        document.querySelector('.canceled-statistic').innerHTML = canceled + '%';
        document.querySelector('.completed-statistic').innerHTML = listCompleted + '%';
        document.querySelector('.todo-list__pie-chart').style.background = 'conic-gradient(#fc6364 ' + canceled + '%, #feb633 ' + canceled + '% ' + (canceled + inProgress) + '%, #9acf66 ' + (canceled + inProgress) + '% 100%)';
    }
}

/**
 * ToDo List initialisation on document load
 */
document.addEventListener("DOMContentLoaded", function () {
    let toDoListProto = new toDoList();
    toDoListProto.init()
});






