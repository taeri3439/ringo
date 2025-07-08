package com.example.ringo.qna.service;

import com.example.ringo.command.QnaVO;
import com.example.ringo.qna.mapperJava.QnaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QnaServiceImpl implements QnaService {

    @Autowired
    private QnaMapper qnaMapper;

    @Override
    public void insertQna(QnaVO vo) {
        qnaMapper.insertQna(vo);
    }

    @Override
    public List<QnaVO> getQnaListPaging(int start, int amount, String keyword) {
        return qnaMapper.getQnaListPaging(start, amount, keyword);
    }

    @Override
    public int getTotalQnaCount(String keyword) {
        return qnaMapper.getTotalQnaCount(keyword);
    }

//    @Override
//    public List<QnaVo> getQnaList() {
//        return qnaMapper.getQnaList();
//    }


}
