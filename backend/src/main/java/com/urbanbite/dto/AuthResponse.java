package com.urbanbite.dto;

import com.urbanbite.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String email;
    private String fullName;
    private Role role;
    private boolean isVerified;
    private Long restaurantId;
    private String message;
}
