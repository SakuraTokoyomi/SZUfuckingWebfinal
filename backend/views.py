from flask_mail import Message,Mail
 
mail = Mail()
 
@bp.route('/email_captcha/')
@login_requires
def email_captcha():
    email = request.args.get('email')
    if not email:
        return restful.params_error('请输入邮箱')  #restful. 封装的函数，返回前端数据
    '''
    生成随机验证码，保存到memcache中，然后发送验证码，与用户提交的验证码对比
    '''
    captcha = str(uuid.uuid1())[:6]  # 随机生成6位验证码
    # 给用户提交的邮箱发送邮件
    message = Message('Python论坛邮箱验证码', recipients=[email], body='您的验证码是：%s' % captcha)
    try:
        mail.send(message)  # 发送
    except:
        return restful.server_error()
    mbcache.set(email, captcha)
    return restful.success()