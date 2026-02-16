import "../config/global.js";
import User from "../model/user.js";

async function registerUser(body: any) {
    try {
        let { name, email, user_name, password, role, level, is_active, login_by, token } = body;

        if (!name || !email || !password || !login_by) {
            return { error: "Fields are Required" };
        }

        const hash_password = await bcrypt.hash(password, 10);

        // Set Defaults
        role = role || "user";
        login_by = login_by || "initial";
        is_active = is_active !== undefined ? is_active : true;
        level = level !== undefined ? level : 1;

        const check_mail = await User.findOne({ email });
        if (check_mail) {
            return { error: "User already exists" };
        }
        
        const newUser = new User({ 
            name, 
            email, 
            user_name,
            password: hash_password, 
            role, 
            level, 
            is_active, 
            login_by, 
            token 
        });
        
        await newUser.save();
        return newUser;
        
    } catch (error) {
        console.log(error);
        return { error: "Internal server error" };
    }
}

async function loginUser(body: any) {
    try {
        let { user_name, password } = body;

        if (!password) {
            return { error: "PassWord is Required" };
        }

        const user = await User.findOne({ user_name  });
        if (!user) {
            return { error: "User not found" };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { error: "Invalid password" };
        }

        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                role: user.role,
                name: user.name,
                user_name: user.user_name
            },
            SECRET_KEY,
            { expiresIn: '1d' }
        );

        return { user, token };
    } catch (error) {
        console.log(error);
        return { error: "Internal server error" };
    }
}


export default { 
    registerUser,
    loginUser,
};