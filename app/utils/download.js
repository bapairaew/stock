const a = document.createElement('a');
document.body.appendChild(a);
a.style = 'display: none';

export default function download(url, filename) {
  a.href = url;
  a.download = filename;
  a.click();
}
