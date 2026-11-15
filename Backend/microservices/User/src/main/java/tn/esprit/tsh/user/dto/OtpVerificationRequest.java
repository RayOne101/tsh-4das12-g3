package tn.esprit.tsh.user.dto;

import lombok.Data;

@Data
public class OtpVerificationRequest {
    private String telephone;
    private String code;
}
