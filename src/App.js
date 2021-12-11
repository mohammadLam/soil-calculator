import { BrowserRouter as Router, Route } from 'react-router-dom'
import About from './components/About'
import Contact from './components/Contact'
import Home from './components/Home'
import Main from './components/Main'
import Navbar from './components/Navbar'
import Portfolio from './components/Portfolio'

export default function App() {
    return (
        <Router>
            <Navbar />
            <Route path="/" component={Home} exact />
            <Route path="/calculate" component={Main} />
            <Route path="/portfolio" component={Portfolio} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
        </Router>
    )
}