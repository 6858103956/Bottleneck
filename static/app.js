const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const conversation = document.querySelector('#conversation');
const welcome = document.querySelector('#welcome');
const documentInput = document.querySelector('#document-input');
const documentList = document.querySelector('#document-list');
const collectionStatus = document.querySelector('#collection-status');

// The browser owns the conversation. It is sent with each request and is not persisted.
const history = [];

async function refreshDocuments() {
  try {
    const response = await fetch('/api/documents');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not load documents.');
    documentList.replaceChildren();
    if (!data.documents.length) {
      const empty = document.createElement('li');
      empty.className = 'empty-documents';
      empty.textContent = 'No documents uploaded yet.';
      documentList.append(empty);
      return;
    }
    for (const doc of data.documents) {
      const item = document.createElement('li');
      item.className = 'document-item';
      const details = document.createElement('div');
      details.className = 'document-details';
      const name = document.createElement('span');
      name.className = 'document-name';
      name.textContent = doc.filename;
      name.title = doc.filename;
      const size = document.createElement('span');
      size.className = 'document-size';
      size.textContent = doc.size;
      details.append(name, size);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'delete-document';
      remove.textContent = 'Delete';
      remove.setAttribute('aria-label', `Delete ${doc.filename}`);
      remove.addEventListener('click', async () => {
        remove.disabled = true;
        try {
          const result = await fetch(`/api/documents/${encodeURIComponent(doc.id)}`, { method: 'DELETE' });
          const body = await result.json();
          if (!result.ok) throw new Error(body.error || 'Could not delete document.');
          await refreshDocuments();
          collectionStatus.textContent = 'Document deleted from your local collection.';
        } catch (error) {
          collectionStatus.textContent = error.message;
          remove.disabled = false;
        }
      });
      item.append(details, remove);
      documentList.append(item);
    }
  } catch (error) {
    collectionStatus.textContent = error.message;
  }
}

documentInput.addEventListener('change', async () => {
  const files = [...documentInput.files];
  for (const file of files) {
    collectionStatus.textContent = `Reading and indexing ${file.name}…`;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('/api/documents', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Could not upload ${file.name}.`);
      collectionStatus.textContent = `${data.document.filename} added (${data.document.chunks} text chunks indexed).`;
      await refreshDocuments();
    } catch (error) {
      collectionStatus.textContent = error.message;
    }
  }
  documentInput.value = '';
});

refreshDocuments();

function addMessage(role, content, extraClass = '') {
  welcome.hidden = true;
  const row = document.createElement('div');
  row.className = `message ${role} ${extraClass}`.trim();
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = role === 'user' ? 'Y' : '✳';
  avatar.setAttribute('aria-hidden', 'true');
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = content;
  row.append(avatar, bubble);
  conversation.append(row);
  conversation.scrollTop = conversation.scrollHeight;
  return row;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const content = input.value.trim();
  if (!content || sendButton.disabled) return;

  history.push({ role: 'user', content });
  addMessage('user', content);
  input.value = '';
  input.style.height = 'auto';
  sendButton.disabled = true;
  const pending = addMessage('assistant', 'Thinking…', 'typing');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });
    const data = await response.json();
    pending.remove();
    if (!response.ok) throw new Error(data.error || 'The request could not be completed.');
    history.push(data.message);
    addMessage('assistant', data.message.content);
  } catch (error) {
    pending.remove();
    addMessage('assistant', error.message || 'Could not connect to the chat server.', 'error');
  } finally {
    sendButton.disabled = false;
    input.focus();
  }
});

input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 150)}px`;
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
