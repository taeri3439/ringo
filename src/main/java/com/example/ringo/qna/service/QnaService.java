package com.example.ringo.qna.service;

import com.example.ringo.command.QnaVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface QnaService {
    void insertQna(QnaVO vo);

    List<QnaVO> getQnaListPaging(@Param("start") int start,
                                 @Param("amount") int amount,
                                 @Param("keyword") String keyword);

    int getTotalQnaCount(@Param("keyword") String keyword);
}
