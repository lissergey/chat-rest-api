const mongoose = require('mongoose');
const { Router } = require('express');
const Message = require('../model/message');

const { authenticate } = require('../middleware/authmiddleware');

function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
  
    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
  
    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;
  
    return dd + '.' + mm + '.' + yy;
  }

module.exports = ({config, db}) => {
    let api = Router();

    api.post('/add', authenticate, (req, res) => {
        let newDate = formatDate(new Date());
        let newMess = new Message();
        newMess.name = req.body.name;
        newMess.email = req.body.email;
        newMess.text = req.body.text;
        newMess.createDate = newDate;
        newMess.updateDate = newDate;

        newMess.save(err => {
            if(err) {
                res.setEncoding(err);
            }
            res.json({ message: 'Message saved successfuly'});
        });
    });


    api.get('/', (req, res) => {
        Message.find({}, (err, messages) => {
            if(err) {
                res.send(err);
            }
            res.json(messages);
        });
    });

    api.get('/:id', (req, res) => {
        Message.findById(req.params.id, (err, message) => {
            if (err) {
                res.send(err);
            }
            res.json(message);
        });
    });

    api.put('/:id', authenticate, (req, res) => {
        Message.findById(req.params.id, (err, message) => {
            if (err) {
                res.send(err);
            }
            message.name = req.body.name;
            message.save(err =>  {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "Message updated!"});
            });
        });
    });

    api.delete('/:id', authenticate, (req, res) => {
        Message.remove({
            _id: req.params.id 
        }, (err, message) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: "Message Successfully Removed!"});
        });
    });

    return api;
}