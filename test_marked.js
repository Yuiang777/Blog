import { marked } from 'marked';
try {
  if (marked.parse) {
    console.log('marked.parse exists');
  } else {
    console.log('marked.parse does NOT exist');
  }
} catch (e) {
  console.error(e);
}
