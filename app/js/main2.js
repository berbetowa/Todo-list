'use strict'

function setLists(lists) {
    localStorage.setItem('lists', JSON.stringify(lists));
}

function getLists() {
    return JSON.parse(localStorage.getItem('lists'));
}

function removeList(self) {
    let item = self.closest('.todo-list__content--item'),
        index = parseInt(item.querySelector('.todo-list__content--title').getAttribute('data-id')),
        listRemoved = getLists();
    if (confirm("Are you sure you want to remove this list?")) {

        listRemoved.splice(getIndex(index), 1);
        setLists(listRemoved);

        item.remove();
    }
}

function setNewList(e) {
    e.preventDefault();

    let listCreated = getLists(),
        lastIndex = 0,
        idNumber = 0;

    if (listCreated.length) {
        lastIndex = listCreated.length;
        idNumber = ++getLastIdList().id;
    }

    listCreated.push({ name: 'List' + idNumber, id: idNumber, items: [] });
    setLists(listCreated);

    createnewList(listCreated[lastIndex].name, idNumber);
}

function getLastIdList() {
    let listCreated = getLists();

    let max = listCreated.reduce(function (prev, current) {
        if (+current.id > +prev.id) {
            return current;
        } else {
            return prev;
        }
    });

    return max;
}

function getLastId(index) {
    let listCreated = getLists();

    let max = listCreated[index].items.reduce(function (prev, current) {
        if (+current.id > +prev.id) {
            return current;
        } else {
            return prev;
        }
    });

    return max;
}

function getState() {
    let listCreated = getLists();

    listCreated.map(function (list) {
        createnewList(list.name, list.id);
        list.items.map(function (item) {
            getNewListItem(item.name, item.id, item.status, item.canceled);
        })
    });

}

function getListNameEdit(e) {
    e.stopPropagation();

    let editIconParent = this.closest('.todo-list__content--title'),
        saveButton = editIconParent.querySelector('.save-icon');

    editIconParent.querySelector('.todo-list__content--name').style.pointerEvents = 'all';
    editIconParent.querySelector('.todo-list__content--name').focus();
    this.style.display = 'none';
    saveButton.style.display = 'inline-block';

    saveButton.addEventListener('click', function (e) {
        e.stopPropagation();

        let title = this.closest('.todo-list__content--title'),
            index = parseInt(title.getAttribute('data-id')),
            inputValue = title.querySelector('.todo-list__content--name').value,
            listCreated = getLists();

        listCreated[getIndex(index)].name = inputValue;
        setLists(listCreated);

        this.style.display = 'none';
        title.querySelector('.edit-icon').style.display = 'inline-block';
        title.querySelector('.todo-list__content--name').style.pointerEvents = 'none';
    });
}

function getIndex(id) {
    let index = false,
        listCreated = getLists();

    listCreated.forEach(function (item, i) {
        if (item.id === id) {
            index = i
        }
    });
    return index;
}

function getItemsIndex(listId, itemId) {
    let index = false,
        listCreated = getLists();

    listCreated[listId].items.forEach(function (item, i) {
        if (item.id === itemId) {
            index = i
        }
    });
    return index;
}

function addNewListItem(e) {
    e.preventDefault();

    let list = this.closest('.todo-list__content--list'),
        title = list.closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
        id = parseInt(title.getAttribute('data-id')),
        listCreated = getLists(),
        index = getIndex(id),
        idNumber = 0;

    if (listCreated[index].items.length) {
        idNumber = ++getLastId(index).id;
    }

    list.append(createNewListItem('Item' + idNumber, idNumber));

    listCreated[index].items.push({ name: 'Item' + idNumber, id: idNumber, status: false, canceled: false });

    setLists(listCreated);

    getStatistic();
}

function getNewListItem(name, id, status, canceled) {
    let listsParent = document.querySelector('.todo-list__content--items'),
        lists = listsParent.querySelectorAll('.todo-list__content--item'),
        list = lists[lists.length - 1];

    list.querySelector('.todo-list__content--list').append(createNewListItem(name, id, status, canceled));
}

function changeStatus(e) {
    let item = e.target.closest('.todo-list__content--list__item'),
        itemId = parseInt(item.getAttribute('data-id')),
        title = item.closest('.todo-list__content--list').closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
        listId = parseInt(title.getAttribute('data-id')),
        listCreated = getLists(),
        indexItem = getItemsIndex(listId, itemId),
        indexList = getIndex(listId);

    listCreated[indexList].items[indexItem].status = !listCreated[indexList].items[indexItem].status;

    setLists(listCreated);

    getStatistic();
}

function removeItem(self) {
    let item = self.closest('.todo-list__content--list__item'),
        itemId = parseInt(item.getAttribute('data-id')),
        title = item.closest('.todo-list__content--list').closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
        listId = parseInt(title.getAttribute('data-id')),
        indexItem = getItemsIndex(listId, itemId),
        indexList = getIndex(listId),
        listRemoved = getLists();
    if (confirm("Are you sure you want to remove this task?")) {
        listRemoved[indexList].items.splice(indexItem, 1);
        setLists(listRemoved);

        item.remove();

        getStatistic();
    }
}

function getItemsNameEdit() {
    let item = this.closest('.todo-list__content--list__item'),
        saveButton = item.querySelector('.item__save-icon');

    item.querySelector('.todo-list__content--text').style.pointerEvents = 'all';
    item.querySelector('.todo-list__content--text').focus();
    this.style.display = 'none';
    saveButton.style.display = 'inline-block';

    saveButton.addEventListener('click', function () {
        let item = this.closest('.todo-list__content--list__item'),
            itemId = parseInt(item.getAttribute('data-id')),
            title = item.closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
            listId = parseInt(title.getAttribute('data-id')),
            indexItem = getItemsIndex(listId, itemId),
            indexList = getIndex(listId),
            listCreated = getLists(),
            inputValue = item.querySelector('.todo-list__content--text').value;

        listCreated[indexList].items[indexItem].name = inputValue;
        setLists(listCreated);


        this.style.display = 'none';
        item.querySelector('.todo-list__content--text').style.pointerEvents = 'none';
        item.querySelector('.item__edit-icon').style.display = 'inline-block';
    });
}

function cancellationOfTheTask(e) {
    let item = e.target.closest('.todo-list__content--list__item'),
        itemId = parseInt(item.getAttribute('data-id')),
        title = item.closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
        listId = parseInt(title.getAttribute('data-id')),
        listCreated = getLists(),
        indexItem = getItemsIndex(listId, itemId),
        indexList = getIndex(listId);

    item.classList.add('_canceled');

    listCreated[indexList].items[indexItem].canceled = true;

    setLists(listCreated);

    getStatistic();
}

function returnTask(e) {
    let item = e.target.closest('.todo-list__content--list__item'),
        itemId = parseInt(item.getAttribute('data-id')),
        title = item.closest('.todo-list__content--item').querySelector('.todo-list__content--title'),
        listId = parseInt(title.getAttribute('data-id')),
        listCreated = getLists(),
        indexItem = getItemsIndex(listId, itemId),
        indexList = getIndex(listId);

    item.classList.remove('_canceled');

    listCreated[indexList].items[indexItem].canceled = false;

    setLists(listCreated);

    getStatistic();
}

function createNewListItem(name, id, status, canceled) {
    let checked = '';
    let canceledClass = '';
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

    newListItem.querySelector('.todo-list__content--checker').addEventListener('change', changeStatus);
    newListItem.querySelector('.item__remove-icon').addEventListener('click', function () {
        removeItem(this);
    });
    newListItem.querySelector('.item__edit-icon').addEventListener('click', getItemsNameEdit);
    newListItem.querySelector('.item__canceled-icon').addEventListener('click', cancellationOfTheTask);
    newListItem.querySelector('.item__return-icon').addEventListener('click', returnTask);

    return newListItem;
}

function createnewList(name, number) {
    let $lists = document.querySelector('.todo-list__content--items'),
        newList = document.createElement('div');

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
        removeList(this);
    });

    newList.querySelector('.edit-icon').addEventListener('click', getListNameEdit);
    newList.querySelector('.add-icon').addEventListener('click', addNewListItem);
    $lists.append(newList);
}

document.addEventListener("DOMContentLoaded", function () {
    if (!localStorage.getItem('lists')) {
        setLists([]);
    }
    getState();
    getStatistic();

    document.querySelector('.todo-list__content--link')
        .addEventListener('click', setNewList);
});

function getStatistic() {
    let listCreated = getLists(),
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
