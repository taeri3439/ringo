package com.example.ringo.controller;

import com.example.ringo.command.*;
import com.example.ringo.lecture.service.LectureService;
import com.example.ringo.mypage.mapperJava.UserClassMapper;
import com.example.ringo.mypage.service.GosuClassService;
import com.example.ringo.mypage.service.UserClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mypage")
public class MyPageRestController {

    @Autowired
    private UserClassService userClassService;
    @Autowired
    private LectureService lectureService;
    @Autowired
    private GosuClassService gosuClassService;

//    @GetMapping("/mystudyclass")
//    public List<MyPageVO> getMyApplyClass(@RequestParam int userPrimaryId) {
//        return userClassService.getMyApplyClass(userPrimaryId);
//    }

    @GetMapping("/mywish")
    public List<MyPageVO> getMyWish(@RequestParam int userPrimaryId) {
        return userClassService.getMyWish(userPrimaryId);
    }

    @PostMapping("/updatewish")
    public ResponseEntity<String> updateWish(@RequestBody MyPageVO vo) {
        userClassService.saveOrUpdateWish(vo);
        return ResponseEntity.ok("");

    }

    @GetMapping("/myreview")
    public List<MyPageVO> getMyReview(@RequestParam int userPrimaryId) {
        return userClassService.getMyReview(userPrimaryId);
    }

    @GetMapping("/timetable")
    public List<ScheduleVO> getTimetable(@RequestParam int userPrimaryId) {
        return userClassService.getTimetable(userPrimaryId);
    }

    @PostMapping("/timetablesave")
    public ResponseEntity<?> saveTimetable(@RequestBody MyPageVO vo) {
        userClassService.saveTimetable(vo);
        return ResponseEntity.ok("");
    }

    @GetMapping("/mystudyclass")
    public List<ClassManageVO> getMyStudyClass(@RequestParam Integer userPrimaryId) {
        return userClassService.getMyStudyClass(userPrimaryId);
    }

    @GetMapping("/myfinishedclass")
    public List<ClassManageVO> getMyFinishedClass(@RequestParam Integer userPrimaryId) {
        return userClassService.getMyFinishedClass(userPrimaryId);
    }

    @GetMapping("/mystudyclass/latest3")
    public List<ClassManageVO> getMyStudyClassLatest3(@RequestParam Integer userPrimaryId) {
        return userClassService.getMyStudyClassLatest3(userPrimaryId);
    }

    @GetMapping("/myfinishedclass/latest3")
    public List<ClassManageVO> getMyFinishedClasslatest3(@RequestParam Integer userPrimaryId) {
        return userClassService.getMyFinishedClass(userPrimaryId);
    }

    @GetMapping("/mystudyclass/count")
    public Map<String, Integer> getMyStudyClassCount(@RequestParam Integer userPrimaryId) {
        int count = userClassService.getMyStudyClassCount(userPrimaryId);
        return Map.of("count", count); // {"count": 4} 형태로 반환
    }

    @GetMapping("/myfinishedclass/count")
    public Map<String, Integer> getMyFinishedClassCount(@RequestParam Integer userPrimaryId) {
        int count = userClassService.getMyFinishedClassCount(userPrimaryId);
        return Map.of("count", count);
    }

    @PostMapping("/lecturereviewwrite")
    @ResponseBody
    public ResponseEntity<?> writeLectureReview(@RequestBody RecruitmentReviewVO vo, HttpSession session) {
        UsersVO loginUser = (UsersVO) session.getAttribute("loginUser");

        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        vo.setUserPrimaryId(Integer.valueOf(loginUser.getUserPrimaryId())); // 세션 기반 작성자 ID
        lectureService.writeLectureReview(vo);

        return ResponseEntity.ok("리뷰 등록 완료");
    }

    // 내가 작성한 강의(글) 목록 조회
    @GetMapping("/mylectures")
    public List<RecruitmentPostVO> getMyLectures(@RequestParam Long userPrimaryId) {
        return gosuClassService.findLecturesByUserId(userPrimaryId);
    }

    // 내가 작성한 강의 전체에 달린 리뷰 한 번에 조회
    @GetMapping("/myclassreviews")
    public List<RecruitmentReviewVO> getMyClassReviews(@RequestParam Long userPrimaryId) {
        return gosuClassService.findReviewsForMyLectures(userPrimaryId);
    }



}
