from flask import Flask, render_template, request, escape
import markdown2
import glob

app = Flask(__name__)

socialLinks = [
    {
        'url': 'http://github.com/mdamaceno',
        'icon': 'logo-github',
    },
    {
        'url': 'https://www.linkedin.com/in/marcodamaceno',
        'icon': 'logo-linkedin',
    }
]

@app.route('/')
def index():
    files = glob.glob('posts/**/*.md')
    postsList = []
    for file in files:
        f = open(file, 'r', encoding='utf-8')
        data = f.read()
        f.close()
        html = markdown2.markdown(data, extras=['metadata'])
        metadata = html.metadata
        postsList.append({
            'title': metadata['title'],
            'created_at': metadata['created_at'],
            'url': '/blog/' + file.replace('.md', '')
        })

    return render_template('layout-home.html', title='Marco Damaceno', posts=postsList, socialLinks=socialLinks)

@app.route('/blog/posts/<category>/<name>')
def show_post(category, name):
    file = open('posts/%s/%s.md' %(escape(category), escape(name)), 'r', encoding='utf-8')
    data = file.read()
    html = markdown2.markdown(data, extras=['metadata'])
    file.close()

    metadata = html.metadata
    post = {
        'title': metadata['title'],
        'created_at': metadata['created_at'],
        'content': html
    }

    return render_template('post.html', post=post, socialLinks=socialLinks)

if __name__ == '__main__':
    app.run(debug=True)
