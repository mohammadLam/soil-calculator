import React, { useReducer } from 'react'

const feedback = {
    name: '',
    email: '',
    feedback: '',
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'name':
            return { ...state, name: action.value }

        case 'email':
            return { ...state, email: action.value }

        case 'feedback':
            return { ...state, feedback: action.value }

        default:
            return state
    }
}

function Contact() {
    const [feedbackInfo, dispatch] = useReducer(reducer, feedback)

    return (
        <div className="container">
            <div className="row">
                <div>
                    <h1 className="mb-3">
                        আপনার মূল্যবান মন্তব্য লিখে পাঠিয়ে দিনঃ
                    </h1>

                    <div className="form-group">
                        <label id="feedback">আপনার নাম লিখুন</label>
                        <input
                            className="form-control"
                            placeholder="আপনার নাম লিখুন"
                            onChange={(e) => {
                                dispatch({
                                    type: 'name',
                                    value: e.target.value,
                                })
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label id="feedback">আপনার ইমেল লিখুন</label>
                        <input
                            className="form-control"
                            placeholder="আপনার ইমেল লিখুন"
                            onChange={(e) => {
                                dispatch({
                                    type: 'email',
                                    value: e.target.value,
                                })
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label id="feedback">আপনার মতামত দিন</label>
                        <textarea
                            rows="15"
                            className="form-control"
                            placeholder="আপনার মতামত দিন"
                            onChange={(e) => {
                                dispatch({
                                    type: 'feedback',
                                    value: e.target.value,
                                })
                            }}
                        ></textarea>
                    </div>
                </div>

                <div>
                    <h1>আপনার নামঃ {feedbackInfo.name}</h1>
                    <h2>আপনার ইমেলঃ {feedbackInfo.email}</h2>
                    <h3>আপনার মন্তব্যঃ {feedbackInfo.feedback}</h3>
                </div>
            </div>
        </div>
    )
}

export default Contact
