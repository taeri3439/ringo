package com.example.ringo.notice.service;

import com.example.ringo.command.NoticeVO;
import com.example.ringo.notice.mapperJava.NoticeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeServiceImpl implements NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;

//    @Override
//    public List<NoticeVO> getNoticeList() {
//        return noticeMapper.getNoticeList();
//    }

    @Override
    public List<NoticeVO> getNoticeListPaging(int start, int amount, String keyword) {
        return noticeMapper.getNoticeListPaging(start, amount, keyword);
    }

    @Override
    public int getTotalNoticeCount(String keyword) {
        return noticeMapper.getTotalNoticeCount(keyword);
    }
}
