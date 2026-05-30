"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { checkApiHealth } from "@/core/http";

export default function ServerError() {
    const router = useRouter();
    const [dots, setDots] = useState("");
    const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);
    const [mounted, setMounted] = useState(false);
    const [isCheckingHealth, setIsCheckingHealth] = useState(false);
    const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);

    useEffect(() => {
        setMounted(true);
        // Generate particles only on client side
        const particleData = Array.from({ length: 20 }, () => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
        }));
        setParticles(particleData);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // بررسی خودکار سلامت API هر 5 ثانیه
    useEffect(() => {
        if (!autoRetryEnabled) return;

        const checkHealth = async () => {
            try {
                const isHealthy = await checkApiHealth();
                if (isHealthy) {
                    // اگر API سالم شد، صفحه را reload می‌کنیم
                    window.location.reload();
                }
            } catch (err) {
                console.error('Auto health check failed:', err);
            }
        };

        // اولین بررسی بعد از 3 ثانیه
        const initialTimeout = setTimeout(() => {
            checkHealth();
        }, 3000);

        // بررسی‌های بعدی هر 5 ثانیه
        const interval = setInterval(() => {
            checkHealth();
        }, 5000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [autoRetryEnabled]);

    // تابع برای بررسی سلامت و reload دستی
    const handleRetry = async () => {
        setIsCheckingHealth(true);
        setAutoRetryEnabled(false); // غیرفعال کردن retry خودکار هنگام کلیک دستی

        try {
            const isHealthy = await checkApiHealth();
            if (isHealthy) {
                // اگر API سالم است، صفحه را reload می‌کنیم
                window.location.reload();
            } else {
                // اگر هنوز خطا دارد، retry خودکار را دوباره فعال می‌کنیم
                setAutoRetryEnabled(true);
                setIsCheckingHealth(false);
            }
        } catch (err) {
            console.error('Health check failed:', err);
            setAutoRetryEnabled(true);
            setIsCheckingHealth(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Animated Background Particles - Only render on client */}
            {mounted && (
                <div style={styles.particles}>
                    {particles.map((particle, i) => (
                        <motion.div
                            key={i}
                            style={{
                                ...styles.particle,
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.3, 0.7, 0.3],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: particle.duration,
                                repeat: Infinity,
                                delay: particle.delay,
                            }}
                        />
                    ))}
                </div>
            )}

            <motion.div
                style={styles.card}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                {/* Main Icon Container with Pulse Effect */}
                <motion.div
                    style={styles.iconContainer}
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <motion.div
                        style={styles.iconWrapper}
                        animate={{
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <i className="fa fa-server" style={styles.mainIcon}></i>
                    </motion.div>
                    
                    {/* Rotating Warning Icons */}
                    <motion.div
                        style={styles.warningIcon1}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <i className="fa fa-exclamation-triangle"></i>
                    </motion.div>
                    <motion.div
                        style={styles.warningIcon2}
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        <i className="fa fa-cloud"></i>
                    </motion.div>
                </motion.div>

                {/* Title with Fade In */}
                <motion.h1
                    style={styles.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    خطای اتصال به سرور
                </motion.h1>

                {/* Subtitle */}
                <motion.div
                    style={styles.subtitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <i className="fa fa-wifi" style={styles.wifiIcon}></i>
                    <span>مشکل در برقراری ارتباط</span>
                </motion.div>

                {/* Description Text */}
                <motion.p
                    style={styles.text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                >
                    متأسفانه ارتباط با سرور برقرار نشد یا اطلاعاتی دریافت نشد.
                    <br />
                    لطفاً اتصال اینترنت خود را بررسی کرده و کمی بعد دوباره تلاش کنید.
                </motion.p>

                {/* Loading Indicator */}
                <motion.div
                    style={styles.loadingText}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                >
                    {isCheckingHealth ? "در حال بررسی سلامت سرور" : autoRetryEnabled ? "در حال بررسی خودکار" : "در حال بررسی"}{dots}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    style={styles.actions}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <motion.button
                        whileHover={{ 
                            scale: isCheckingHealth ? 1 : 1.05,
                            boxShadow: isCheckingHealth ? "0 4px 15px rgba(25, 118, 210, 0.2)" : "0 8px 25px rgba(25, 118, 210, 0.4)"
                        }}
                        whileTap={{ scale: isCheckingHealth ? 1 : 0.95 }}
                        onClick={handleRetry}
                        disabled={isCheckingHealth}
                        style={{
                            ...styles.primaryBtn,
                            opacity: isCheckingHealth ? 0.7 : 1,
                            cursor: isCheckingHealth ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <i className={`fa ${isCheckingHealth ? 'fa-spinner fa-spin' : 'fa-refresh'}`} style={styles.btnIcon}></i>
                        {isCheckingHealth ? "در حال بررسی..." : "تلاش مجدد"}
                    </motion.button>

                    <motion.button
                        whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push("/")}
                        style={styles.secondaryBtn}
                    >
                        <i className="fa fa-home" style={styles.btnIcon}></i>
                        بازگشت به صفحه اصلی
                    </motion.button>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                    style={styles.decorativeCircle1}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    style={styles.decorativeCircle2}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgb(12, 12, 12)",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
    },
    particles: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 0,
    },
    particle: {
        position: "absolute",
        width: "4px",
        height: "4px",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: "50%",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: "30px",
        padding: "50px 40px",
        maxWidth: "550px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
    },
    iconContainer: {
        position: "relative",
        width: "140px",
        height: "140px",
        margin: "0 auto 30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    iconWrapper: {
        position: "relative",
        zIndex: 2,
    },
    mainIcon: {
        fontSize: "80px",
        color: "#d32f2f",
        filter: "drop-shadow(0 4px 8px rgba(211, 47, 47, 0.3))",
    },
    warningIcon1: {
        position: "absolute",
        top: "10px",
        right: "10px",
        fontSize: "32px",
        color: "#ff9800",
        zIndex: 1,
    },
    warningIcon2: {
        position: "absolute",
        bottom: "10px",
        left: "10px",
        fontSize: "28px",
        color: "#f44336",
        zIndex: 1,
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        marginBottom: "15px",
        background: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        lineHeight: "1.4",
    },
    subtitle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        fontSize: "18px",
        color: "#666",
        marginBottom: "20px",
        fontWeight: "500",
    },
    wifiIcon: {
        fontSize: "20px",
        color: "#ff9800",
        animation: "pulse 2s infinite",
    },
    text: {
        fontSize: "16px",
        color: "#555",
        lineHeight: "2",
        marginBottom: "25px",
        fontWeight: "400",
    },
    loadingText: {
        fontSize: "14px",
        color: "#999",
        marginBottom: "30px",
        fontStyle: "italic",
    },
    actions: {
        display: "flex",
        gap: "15px",
        justifyContent: "center",
        flexWrap: "wrap",
    },
    primaryBtn: {
        padding: "14px 28px",
        borderRadius: "12px",
        border: "none",
        background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
        color: "#fff",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
    },
    secondaryBtn: {
        padding: "14px 28px",
        borderRadius: "12px",
        border: "2px solid #e0e0e0",
        backgroundColor: "#fff",
        color: "#333",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    },
    btnIcon: {
        fontSize: "16px",
    },
    decorativeCircle1: {
        position: "absolute",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(211, 47, 47, 0.1) 0%, transparent 70%)",
        top: "-100px",
        right: "-100px",
        zIndex: 0,
    },
    decorativeCircle2: {
        position: "absolute",
        width: "250px",
        height: "250px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%)",
        bottom: "-125px",
        left: "-125px",
        zIndex: 0,
    },
};
