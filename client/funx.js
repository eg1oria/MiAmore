import fs from 'fs';
import mammoth from 'mammoth';

async function convertDocx() {
  const { value } = await mammoth.extractRawText({ path: './questions.docx' });
  const lines = value.split('\n').map(l => l.trim()).filter(Boolean);

  const questions = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith('<question>')) {
      if (current) questions.push(current); // добавляем предыдущий вопрос
      current = {
        question: line.replace('<question>', '').trim(),
        point: 0,
        answers: [],
        correct: ''
      };
    } else if (line.startsWith('<point>')) {
      current.point = parseInt(line.replace('<point>', '').trim(), 10);
    } else if (line.startsWith('<variantright>')) {
      const ans = line.replace('<variantright>', '').trim();
      current.correct = ans;
      current.answers.push(ans);
    } else if (line.startsWith('<variant>')) {
      current.answers.push(line.replace('<variant>', '').trim());
    }
  }

  if (current) questions.push(current); // последний вопрос

  fs.writeFileSync('questions.json', JSON.stringify(questions, null, 2), 'utf8');
  console.log('✅ questions.json готов!');
}

convertDocx();
