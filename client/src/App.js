import './App.css';
import {useState} from 'react';

function Header(props) {
  return <header>
  <h1><a href='/' onClick={(event) => {
    event.preventDefault();
    props.onchangeMode();
  }}>{props.title}</a></h1>
  </header>
}

function Nav(props) {
  const list = []

  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    list.push(<li key={t.id}>
      <a id={t.id} href={'/read/' + t.id} onClick={(event) => {
        event.preventDefault();
        props.onchangeMode(Number(event.target.id));
      }}>{t.title}</a></li>);
  }
  return <nav>
    <ol>
      {list}
    </ol>
  </nav>
}

function Article(props) {
  return <article>
    <h2>{props.title}</h2>
    {'마감일: ' + props.date}<br />
    {'내용: ' + props.body}
  </article>
}

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const date = event.target.date.value;
      const body = event.target.body.value;
      props.onCreate(title, date, body);
    }}>
      <p><input type='title' name='title' placeholder='title'/></p>
      <p><input type='date' name='date' /></p>
      <p><textarea name='body' placeholder='body' /></p>
      <p><input type='submit' value='Create'></input></p>
    </form>
  </article>
}

function Update(props){
  const[title, setTitle] = useState(props.title);
  const[date, setDate] = useState(props.date);
  const[body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event => {
      event.preventDefault();
      const title = event.target.title.value;
      const date = event.target.date.value;
      const body = event.target.body.value;
      props.onUpdate(title, date, body);
    }}>
      <p><input type='title' name='title' placeholder='title' value={title} onChange={event => {
        setTitle(event.target.value);
      }} /></p>
      <p><input type='date' name='date' value={date} onChange={event => {
        setDate(event.target.value);
      }} /></p>
      <p><textarea name='body' placeholder='body' value={body} onChange={event => {
        setBody(event.target.value);
      }}/></p>
      <p><input type='submit' value='Update'></input></p>
    </form>
  </article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(1);
  const [topics, setTopics] = useState([]);

  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
    content = <h2 id='bow'>안녕하세요! memo Job입니다.</h2> // 이 부분에 오늘 날짜나 공지들어가면 좋을듯
  }else if(mode === 'READ'){
    let title, date, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        date = topics[i].date;
        body = topics[i].body;
      }
    }
    content = <Article title={title} date={date} body={body}></Article>
    contextControl = (<>
        <li><a href={'/update' + id} onClick={event => {
        event.preventDefault();
        setMode('UPDATE');
        }}>Update</a></li>
      <li><input type='button' value='Delete' onClick={() => {
        const newTopics = [];
        for(let i=0; i<topics.length; i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }} /></li>
    </>
    );
  }else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _date, _body) => {
      const newTopic = {id:nextId, title:_title, date: _date, body:_body}
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  }else if(mode === 'UPDATE'){
    let title, date, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        date = topics[i].date;
        body = topics[i].body;
      }
    }
    content = <Update title={title} date={date} body={body} onUpdate={(title, date, body) => {
      const newTopics = [...topics];
      const updatedTopic = {id:id, title:title, date:date, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }

  return (
    <div className="App">
      <Header title='memo Job' onchangeMode={() => {
        setMode('WELCOME');
      }}></Header>

      {content}
      <Nav topics={topics} onchangeMode={(_id)=> {
        setMode('READ');
        setId(_id);
      }}></Nav>
      
      <ul>
      <li><a href='/create' onClick={event => {
        event.preventDefault();
        setMode('CREATE');
      }}>Create</a></li>
      {contextControl}
      </ul>
    </div>
  );
}

export default App;
