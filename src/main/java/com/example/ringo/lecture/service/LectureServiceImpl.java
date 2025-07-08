package com.example.ringo.lecture.service;

import com.example.ringo.command.ClassManageVO;
import com.example.ringo.command.RecruitmentPostVO;
import com.example.ringo.command.RecruitmentReviewVO;
import com.example.ringo.command.UsersVO;
import com.example.ringo.lecture.mapperJava.LectureMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LectureServiceImpl implements LectureService {

    @Autowired
    private LectureMapper lectureMapper;


//    @Override
//    public void writeRecruitmentPost(RecruitmentPostVO recruitmentPostVO) {
//        lectureMapper.writeRecruitmentPost(recruitmentPostVO);
//    }

    @Override
    public void writeRecruitmentPost(RecruitmentPostVO recruitmentPostVO) {
        //1. 게시글 저장
        lectureMapper.writeRecruitmentPost(recruitmentPostVO);
        int generatedRecruitmentPostId = recruitmentPostVO.getRecruitmentPostId();

        //2. 이미지 URL 저장
        if(recruitmentPostVO.getImageUrls() != null && !recruitmentPostVO.getImageUrls().isEmpty()) {
            for(String url : recruitmentPostVO.getImageUrls()) {
                lectureMapper.insertRecruitmentPostImage(generatedRecruitmentPostId, url);
            }
        }

        //3. 메인 이미지 저장
        if(recruitmentPostVO.getMainImageUrl() != null && !recruitmentPostVO.getMainImageUrl().isEmpty()) {
            lectureMapper.insertRecruitmentPostMainImage(generatedRecruitmentPostId, recruitmentPostVO.getMainImageUrl());
        }
    }

    @Override
    public List<RecruitmentPostVO> getLectures(String category, String search) {
        return lectureMapper.getLectures(category, search);
    }

    @Override
    public RecruitmentPostVO getOneLecture(Integer lectureId) {
        return lectureMapper.getOneLecture(lectureId);
    }

    @Override
    public void enrollClass(ClassManageVO vo) {
        lectureMapper.enrollClass(vo); // Mapper의 insert 메서드 호출
    }


    @Override
    public UsersVO getUserById(int userPrimaryId) {
        return lectureMapper.getUserById(userPrimaryId);
    }

    @Override
    public void writeLectureReview(RecruitmentReviewVO vo) {
        lectureMapper.insertLectureReview(vo);
    }

    @Override
    public List<RecruitmentReviewVO> getLectureReviews(Integer lectureId) {
        return lectureMapper.getLectureReviews(lectureId);
    }

    // LectureServiceImpl.java
    @Override
    public List<RecruitmentPostVO> getPostsByCategory(String category) {
        return lectureMapper.getPostsByCategory(category);
    }

    @Override
    public List<RecruitmentPostVO> getOtherClassByGosu(int userPrimaryId, int excludePostId) {
        return lectureMapper.getOtherClassByGosu(userPrimaryId, excludePostId);
    }

    @Override
    public Map<String, Object> getLectureImages(Integer lectureId) {

        List<RecruitmentPostVO> imageList = lectureMapper.getLectureImages(lectureId);
        Map<String, Object> result = new HashMap<>();

        for (RecruitmentPostVO img : imageList) {
            if (img.isImgMain()) {
                result.put("mainUrl", img.getImgUrl());
            } else {
                List<String> notMain = (List<String>) result.getOrDefault("notMainUrl", new ArrayList<>());
                notMain.add(img.getImgUrl());
                result.put("notMainUrl", notMain);
            }
        }



        return result;
    }

}
