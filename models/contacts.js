const fs = require('fs/promises');
const { nanoid } = require('nanoid');
const path = require('path');

const contactsPath = path.join(__dirname, '/contacts.json');

async function listContacts() {
    const allContacts = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(allContacts);
}

async function getContactById(contactId) {
    const allContacts = await listContacts();
    const contact = allContacts.find(item => item.id === contactId);

    return contact || null;
}

async function removeContact(contactId) {
    const allContacts = await listContacts();
    const index = allContacts.findIndex(item => item.id === contactId);
    if (index === -1) {
        return null;
    }
    const [newContacts] = allContacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return newContacts;
}

async function addContact(name, email, phone) {
    const allContacts = await listContacts();
    const contact = {
        id: nanoid(),
        name,
        email,
        phone,
    };

    allContacts.push(contact);
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return contact;
}

const updateContact = async (contactId, body) => {
    const allContacts = await listContacts();
    const index = allContacts.findIndex(item => item.id === contactId);
    allContacts[index] = { id: contactId, ...body };

    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));

    return allContacts[index];
};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
