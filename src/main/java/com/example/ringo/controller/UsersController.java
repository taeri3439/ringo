package com.example.ringo.controller;

import com.example.ringo.command.UsersVO;
import com.example.ringo.users.service.UsersService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @GetMapping("/test")
    public String test() {
        List<UsersVO> usersVOList = usersService.usersVOList();
        System.out.println(usersVOList.toString());
        return "view";
    }

    @GetMapping("/signup")
    public String signup(Model model) {
        model.addAttribute("pageName", "signup");
        return "sign";
    }

    @PostMapping("/signup")
    @ResponseBody
    public ResponseEntity<String> signup(@RequestBody UsersVO usersVO) {
        usersService.signup(usersVO);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("pageName", "login");
        return "sign";
    }

    @GetMapping("/userinfo")
    public String userinfo(Model model) {
        model.addAttribute("pageName", "userinfo");
        return "sign";
    }

    @PostMapping("/login")
    @ResponseBody
    public Map<String, Object> login(@RequestBody UsersVO usersVO, HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        UsersVO loginUser = usersService.login(usersVO);
        if (loginUser == null) {
            result.put("success", false);
            result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
        } else {
            HttpSession session = request.getSession();
            session.setAttribute("loginUser", loginUser);
            result.put("success", true);
        }
        return result;
    }

    @PostMapping("/logout")
    @ResponseBody
    public Map<String, Object> logout(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        HttpSession session = request.getSession(false); // 기존 세션만 가져옴 (없으면 null)
        if (session != null) {
            session.invalidate(); // 세션 무효화 (로그아웃)
        }
        result.put("success", true);
        result.put("message", "로그아웃 되었습니다.");
        return result;
    }

    @GetMapping("/check-id")
    @ResponseBody
    public boolean checkUserId(@RequestParam String userId) {
        return usersService.isUserIdDuplicate(userId);
    }

    @GetMapping("/idfind")
    public String idfind(Model model) {
        model.addAttribute("pageName", "idfind");
        return "sign";
    }

    @GetMapping("/idfindgood")
    public String idfindGood(Model model) {
        model.addAttribute("pageName", "idfindgood");
        return "sign";
    }

    @GetMapping("/pwchange")
    public String pwchange(Model model) {
        model.addAttribute("pageName", "pwchange");
        return "sign";
    }

    @GetMapping("/pwreset")
    public String pwreset(Model model) {
        model.addAttribute("pageName", "pwreset");
        return "sign";
    }

    @PostMapping("/find-id-action")
    public ResponseEntity<Map<String, Object>> findIdAction(@RequestBody Map<String, String> params) {
        String name = params.get("name");
        String phone = params.get("phone");
        List<UsersVO> foundUsers = usersService.findId(name, phone);
        Map<String, Object> response = new HashMap<>();
        if (foundUsers != null && !foundUsers.isEmpty()) {

            List<Map<String, Object>> idList = new ArrayList<>();
            for (UsersVO user : foundUsers) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", user.getUserId());
                item.put("date", user.getCreatedAt());
                idList.add(item);
            }
            response.put("success", true);
            response.put("userName", foundUsers.get(0).getUserName());
            response.put("idList", idList);
        } else {
            response.put("success", false);
            response.put("message", "일치하는 회원 정보가 없습니다.");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-user-for-reset")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> verifyUser(@RequestBody UsersVO vo, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        // 서비스에서 회원 정보 조회
        UsersVO foundUser = usersService.findUserForReset(vo.getUserName(), vo.getUserId(), vo.getUserPhone());
        if (foundUser != null) {
            // 인증 성공: 세션에 아이디 저장 (비밀번호 재설정 단계에서 사용)
            request.getSession().setAttribute("resetUserId", vo.getUserId());
            response.put("success", true);
        } else {
            response.put("success", false);
            response.put("message", "입력하신 정보와 일치하는 회원이 없습니다.");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password-action")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> params, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        // 세션에서 인증된 아이디 꺼냄
        String userId = (String) session.getAttribute("resetUserId");
        String newPassword = params.get("password");

        if (userId == null) {
            response.put("success", false);
            response.put("message", "비정상적인 접근입니다. 비밀번호 찾기를 처음부터 다시 시도해주세요.");
            return ResponseEntity.ok(response);
        }

        try {
            usersService.updatePassword(userId, newPassword);
            // 비밀번호 변경 성공 시 세션 정보 삭제
            session.removeAttribute("resetUserId");
            response.put("success", true);
            response.put("message", "비밀번호가 성공적으로 변경되었습니다.");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/user/info")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getUserInfo(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        UsersVO loginUser = (UsersVO) session.getAttribute("loginUser");

        if (loginUser == null) {
            response.put("success", false);
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // 프로필 이미지 Base64 인코딩해서 data URL로 반환
        if (loginUser.getUserProfile() != null && loginUser.getUserProfileMimeType() != null) {
            String base64Image = Base64.getEncoder().encodeToString(loginUser.getUserProfile());
            String imageSrc = "data:" + loginUser.getUserProfileMimeType() + ";base64," + base64Image;
            response.put("userProfileImage", imageSrc);
        } else {
            response.put("userProfileImage", null);
        }

        loginUser.setUserPw(null);
        response.put("success", true);
        response.put("user", loginUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/api/user/update")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateUserInfo(
            @RequestPart("userInfoData") String userInfoJson,
            @RequestPart(value = "profileImageFile", required = false) MultipartFile profileImageFile,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();
        UsersVO loginUser = (UsersVO) session.getAttribute("loginUser");

        System.out.println("세션의 loginUser: " + loginUser);

        if (loginUser == null) {
            response.put("success", false);
            response.put("message", "로그인 권한이 없습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        try {
            // 1. JSON -> VO 변환
            ObjectMapper objectMapper = new ObjectMapper();
            UsersVO updatedVO = objectMapper.readValue(userInfoJson, UsersVO.class);

            // 2. 이미지 처리
            if (profileImageFile != null && !profileImageFile.isEmpty()) {
                byte[] imageBytes = profileImageFile.getBytes();
                String mimeType = profileImageFile.getContentType();
                System.out.println("imageBytes length: " + imageBytes.length);
                System.out.println("imageBytes as String: " + new String(imageBytes));

                updatedVO.setUserProfile(imageBytes);
                updatedVO.setUserProfileMimeType(mimeType);
            } else {
                // 이미지 미전송 시 기존 이미지 정보 유지
                updatedVO.setUserProfile(loginUser.getUserProfile());
                updatedVO.setUserProfileMimeType(loginUser.getUserProfileMimeType());
            }

            // 3. 사용자 ID 세팅 (보안상 클라이언트에서 넘어온 값 무시)
            updatedVO.setUserId(loginUser.getUserId());

            // 4. 서비스 호출
            usersService.updateUserInfo(updatedVO);

            // 5. 세션 정보 갱신
            loginUser.setUserName(updatedVO.getUserName());
            loginUser.setUserNickName(updatedVO.getUserNickName());
            loginUser.setUserPhone(updatedVO.getUserPhone());
            loginUser.setUserEmail(updatedVO.getUserEmail());
            loginUser.setUserInterest(updatedVO.getUserInterest());
            loginUser.setUserProfile(updatedVO.getUserProfile());
            loginUser.setUserProfileMimeType(updatedVO.getUserProfileMimeType());
            session.setAttribute("loginUser", loginUser);

            response.put("success", true);
            response.put("message", "회원정보가 성공적으로 수정되었습니다.");
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            // 파일 처리 등에서 예외 발생 시
            response.put("success", false);
            response.put("message", "회원정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/api/user/profile-image")
    public ResponseEntity<byte[]> getProfileImage(HttpSession session) {
        UsersVO loginUser = (UsersVO) session.getAttribute("loginUser");

        System.out.println("세션의 loginUser: " + loginUser);
        if (loginUser != null && loginUser.getUserProfile() != null && loginUser.getUserProfileMimeType() != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(loginUser.getUserProfileMimeType()));
            return new ResponseEntity<>(loginUser.getUserProfile(), headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/api/user/introduction")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> updateIntroduction(
            @RequestBody Map<String, String> body,
            HttpSession session
    ) {
        Map<String, Object> response = new HashMap<>();
        UsersVO loginUser = (UsersVO) session.getAttribute("loginUser");
        if (loginUser == null) {
            response.put("success", false);
            response.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        String title = body.get("introductionTitle");
        String content = body.get("introductionContent");

        loginUser.setIntroductionTitle(title);
        loginUser.setIntroductionContent(content);
        usersService.updateUserInfo(loginUser);

        session.setAttribute("loginUser", loginUser);

        response.put("success", true);
        response.put("message", "소개글이 저장되었습니다.");
        return ResponseEntity.ok(response);
    }



}